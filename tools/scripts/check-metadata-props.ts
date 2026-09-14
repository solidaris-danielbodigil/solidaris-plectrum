/**
 * check-metadata-props.ts
 *
 * Compares each libs/ui `{name}.metadata.ts` `props` list with the public
 * Angular input / model / output API of the colocated `.component.ts`.
 * Also asserts `ALL_COMPONENT_METADATA` lists every metadata file on disk
 * (rule 10 Exception B).
 *
 * Run: npm run contracts:check   (tsx tools/scripts/check-metadata-props.ts)
 *
 * CSS-only blocks (component.path is not an existing *.component.ts) must
 * declare `props: []`.
 */

import * as fs from 'fs';
import * as path from 'path';
import { pathToFileURL } from 'url';
import * as ts from 'typescript';
import type { ComponentMetadata, PropDefinition } from '@solidaris/contracts';
import {
  ALL_COMPONENT_METADATA,
  COMPONENT_METADATA_GLOB,
} from '../../libs/ui/src/storybook/component-metadata';

const WORKSPACE_ROOT = path.resolve(__dirname, '../../');
const UI_LIB_PATH = path.join(WORKSPACE_ROOT, 'libs/ui/src/lib');

interface ExtractedProp {
  name: string;
  required: boolean;
  type: string;
  default?: string;
}

interface Finding {
  component: string;
  file: string;
  messages: string[];
}

function isComponentMetadata(value: unknown): value is ComponentMetadata {
  if (!value || typeof value !== 'object') return false;
  const component = (value as { component?: { name?: unknown } }).component;
  return typeof component?.name === 'string';
}

function findMetadataFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findMetadataFiles(full));
    } else if (entry.isFile() && entry.name.endsWith('.metadata.ts')) {
      results.push(full);
    }
  }
  return results.sort((a, b) => a.localeCompare(b));
}

function toPosix(filePath: string): string {
  return filePath.split(path.sep).join('/');
}

async function importMetadata(absPath: string): Promise<ComponentMetadata> {
  const mod = (await import(pathToFileURL(absPath).href)) as Record<
    string,
    unknown
  >;
  for (const value of Object.values(mod)) {
    if (isComponentMetadata(value)) return value;
  }
  throw new Error(`No ComponentMetadata export in ${toPosix(path.relative(WORKSPACE_ROOT, absPath))}`);
}

function loadCompilerOptions(): ts.CompilerOptions {
  const configPath = path.join(WORKSPACE_ROOT, 'tsconfig.json');
  const { config, error } = ts.readConfigFile(configPath, ts.sys.readFile);
  if (error) {
    throw new Error(
      ts.flattenDiagnosticMessageText(error.messageText, '\n'),
    );
  }
  const parsed = ts.parseJsonConfigFileContent(
    config,
    ts.sys,
    WORKSPACE_ROOT,
  );
  return parsed.options;
}

function hasComponentDecorator(node: ts.ClassDeclaration): boolean {
  return !!node.modifiers?.some((mod) => {
    if (!ts.isDecorator(mod)) return false;
    const expr = mod.expression;
    if (ts.isCallExpression(expr)) {
      return (
        ts.isIdentifier(expr.expression) && expr.expression.text === 'Component'
      );
    }
    return ts.isIdentifier(expr) && expr.text === 'Component';
  });
}

function findComponentClass(
  sourceFile: ts.SourceFile,
): ts.ClassDeclaration | undefined {
  let found: ts.ClassDeclaration | undefined;
  const visit = (node: ts.Node): void => {
    if (ts.isClassDeclaration(node) && hasComponentDecorator(node)) {
      found = node;
      return;
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return found;
}

function isPrivateOrProtected(member: ts.ClassElement): boolean {
  return !!member.modifiers?.some(
    (mod) =>
      mod.kind === ts.SyntaxKind.PrivateKeyword ||
      mod.kind === ts.SyntaxKind.ProtectedKeyword,
  );
}

function memberName(member: ts.ClassElement): string | undefined {
  if (!member.name) return undefined;
  if (ts.isIdentifier(member.name) || ts.isStringLiteral(member.name)) {
    return member.name.text;
  }
  return undefined;
}

function getDecoratorCall(
  member: ts.ClassElement,
  name: string,
): ts.CallExpression | ts.Identifier | undefined {
  if (!member.modifiers) return undefined;
  for (const mod of member.modifiers) {
    if (!ts.isDecorator(mod)) continue;
    const expr = mod.expression;
    if (ts.isCallExpression(expr)) {
      if (ts.isIdentifier(expr.expression) && expr.expression.text === name) {
        return expr;
      }
    } else if (ts.isIdentifier(expr) && expr.text === name) {
      return expr;
    }
  }
  return undefined;
}

function readAliasFromObject(node: ts.Expression | undefined): string | undefined {
  if (!node || !ts.isObjectLiteralExpression(node)) return undefined;
  for (const prop of node.properties) {
    if (
      ts.isPropertyAssignment(prop) &&
      ts.isIdentifier(prop.name) &&
      prop.name.text === 'alias' &&
      ts.isStringLiteralLike(prop.initializer)
    ) {
      return prop.initializer.text;
    }
  }
  return undefined;
}

function readRequiredFromObject(node: ts.Expression | undefined): boolean {
  if (!node || !ts.isObjectLiteralExpression(node)) return false;
  for (const prop of node.properties) {
    if (
      ts.isPropertyAssignment(prop) &&
      ts.isIdentifier(prop.name) &&
      prop.name.text === 'required'
    ) {
      return prop.initializer.kind === ts.SyntaxKind.TrueKeyword;
    }
  }
  return false;
}

interface SignalCall {
  kind: 'input' | 'model' | 'output';
  required: boolean;
  call: ts.CallExpression;
}

function parseSignalCall(call: ts.CallExpression): SignalCall | undefined {
  const expr = call.expression;
  if (ts.isPropertyAccessExpression(expr) && ts.isIdentifier(expr.expression)) {
    const callee = expr.expression.text;
    const method = expr.name.text;
    if ((callee === 'input' || callee === 'model') && method === 'required') {
      return { kind: callee, required: true, call };
    }
    return undefined;
  }
  if (ts.isIdentifier(expr)) {
    if (expr.text === 'input' || expr.text === 'model') {
      return { kind: expr.text, required: false, call };
    }
    if (expr.text === 'output' || expr.text === 'outputFromObservable') {
      return { kind: 'output', required: false, call };
    }
  }
  return undefined;
}

function isLiteralExpression(node: ts.Expression): boolean {
  return (
    ts.isStringLiteralLike(node) ||
    ts.isNumericLiteral(node) ||
    node.kind === ts.SyntaxKind.TrueKeyword ||
    node.kind === ts.SyntaxKind.FalseKeyword ||
    node.kind === ts.SyntaxKind.NullKeyword ||
    (ts.isIdentifier(node) && node.text === 'undefined') ||
    ts.isObjectLiteralExpression(node) ||
    ts.isArrayLiteralExpression(node) ||
    (ts.isPrefixUnaryExpression(node) &&
      ts.isNumericLiteral(node.operand))
  );
}

function stripSurroundingQuotes(text: string): string {
  const trimmed = text.trim();
  if (trimmed.length >= 2) {
    const start = trimmed[0];
    const end = trimmed[trimmed.length - 1];
    if ((start === "'" && end === "'") || (start === '"' && end === '"')) {
      return trimmed.slice(1, -1);
    }
  }
  return trimmed;
}

function literalDefault(call: ts.CallExpression, signal: SignalCall): string | undefined {
  if (signal.kind === 'output') return undefined;
  if (signal.required) return undefined;
  const first = call.arguments[0];
  if (!first || !isLiteralExpression(first)) return undefined;
  const text = first.getText();
  if (ts.isStringLiteralLike(first)) {
    return stripSurroundingQuotes(text);
  }
  return text.trim();
}

function signalOptionsArg(
  call: ts.CallExpression,
  signal: SignalCall,
): ts.Expression | undefined {
  if (signal.kind === 'output') {
    if (ts.isIdentifier(call.expression) && call.expression.text === 'outputFromObservable') {
      return call.arguments[1];
    }
    return call.arguments[0];
  }
  if (signal.required) {
    return call.arguments[0];
  }
  return call.arguments[1];
}

function normalizeTypeText(type: string): string {
  return type.replace(/\s+/g, ' ').replace(/;(\s*})/g, '$1').trim();
}

function normalizeDefault(value: string | undefined): string | undefined {
  if (value === undefined) return undefined;
  return stripSurroundingQuotes(value);
}

function widenInferredType(type: ts.Type, checker: ts.TypeChecker): string {
  if (type.flags & ts.TypeFlags.BooleanLiteral) return 'boolean';
  if (type.flags & ts.TypeFlags.StringLiteral) return 'string';
  if (type.flags & ts.TypeFlags.NumberLiteral) return 'number';
  if (type.flags & ts.TypeFlags.Undefined) return 'undefined';
  if (type.flags & ts.TypeFlags.Null) return 'null';
  return checker.typeToString(
    type,
    undefined,
    ts.TypeFormatFlags.NoTruncation,
  );
}

function firstTypeArgumentText(
  call: ts.CallExpression,
  checker: ts.TypeChecker,
  fallback: string,
): string {
  const explicit = call.typeArguments?.[0];
  if (explicit) {
    return normalizeTypeText(explicit.getText());
  }
  const resolved = checker.getTypeAtLocation(call);
  const typeArgs =
    checker.getTypeArguments(resolved as ts.TypeReference) ??
    (resolved as ts.TypeReference).typeArguments;
  if (typeArgs?.[0]) {
    return normalizeTypeText(widenInferredType(typeArgs[0], checker));
  }
  return fallback;
}

function signalTypeText(
  signal: SignalCall,
  checker: ts.TypeChecker,
): string {
  const inner = firstTypeArgumentText(
    signal.call,
    checker,
    signal.kind === 'output' ? 'void' : 'unknown',
  );
  if (signal.kind === 'model') return `model<${inner}>`;
  if (signal.kind === 'output') return `output<${inner}>`;
  return inner;
}

function decoratorTypeText(
  member: ts.PropertyDeclaration,
  checker: ts.TypeChecker,
  kind: 'input' | 'output',
): string {
  if (member.type) {
    const text = normalizeTypeText(member.type.getText());
    return kind === 'output' ? `output<${text}>` : text;
  }
  if (member.initializer) {
    const type = checker.getTypeAtLocation(member.initializer);
    const typeArgs =
      checker.getTypeArguments(type as ts.TypeReference) ??
      (type as ts.TypeReference).typeArguments;
    if (typeArgs?.[0]) {
      const inner = normalizeTypeText(widenInferredType(typeArgs[0], checker));
      return kind === 'output' ? `output<${inner}>` : inner;
    }
    const inferred = normalizeTypeText(widenInferredType(type, checker));
    return kind === 'output' ? `output<${inferred}>` : inferred;
  }
  return kind === 'output' ? 'output<void>' : 'unknown';
}

function decoratorDefault(member: ts.PropertyDeclaration): string | undefined {
  const init = member.initializer;
  if (!init || !isLiteralExpression(init)) return undefined;
  const text = init.getText();
  if (ts.isStringLiteralLike(init)) {
    return stripSurroundingQuotes(text);
  }
  return text.trim();
}

function decoratorAlias(decorator: ts.CallExpression | ts.Identifier): string | undefined {
  if (!ts.isCallExpression(decorator)) return undefined;
  const first = decorator.arguments[0];
  if (!first) return undefined;
  if (ts.isStringLiteralLike(first)) return first.text;
  return readAliasFromObject(first);
}

function extractPublicApi(
  componentPath: string,
  compilerOptions: ts.CompilerOptions,
): ExtractedProp[] {
  const program = ts.createProgram([componentPath], compilerOptions);
  const checker = program.getTypeChecker();
  const sourceFile = program.getSourceFile(componentPath);
  if (!sourceFile) {
    throw new Error(`TypeScript could not load ${componentPath}`);
  }
  const cls = findComponentClass(sourceFile);
  if (!cls) {
    throw new Error(`No @Component class in ${componentPath}`);
  }

  const props: ExtractedProp[] = [];

  for (const member of cls.members) {
    if (!ts.isPropertyDeclaration(member) || isPrivateOrProtected(member)) {
      continue;
    }
    const declaredName = memberName(member);
    if (!declaredName) continue;

    const inputDec = getDecoratorCall(member, 'Input');
    const outputDec = getDecoratorCall(member, 'Output');
    if (inputDec) {
      const options = ts.isCallExpression(inputDec) ? inputDec.arguments[0] : undefined;
      props.push({
        name: decoratorAlias(inputDec) ?? declaredName,
        required: readRequiredFromObject(
          options && !ts.isStringLiteralLike(options) ? options : undefined,
        ),
        type: decoratorTypeText(member, checker, 'input'),
        default: decoratorDefault(member),
      });
      continue;
    }
    if (outputDec) {
      props.push({
        name: decoratorAlias(outputDec) ?? declaredName,
        required: false,
        type: decoratorTypeText(member, checker, 'output'),
      });
      continue;
    }

    if (!member.initializer || !ts.isCallExpression(member.initializer)) {
      continue;
    }
    const signal = parseSignalCall(member.initializer);
    if (!signal) continue;
    const alias = readAliasFromObject(signalOptionsArg(member.initializer, signal));
    props.push({
      name: alias ?? declaredName,
      required: signal.required,
      type: signalTypeText(signal, checker),
      default: literalDefault(member.initializer, signal),
    });
  }

  return props;
}

function compareProps(
  metadata: PropDefinition[] | undefined,
  extracted: ExtractedProp[],
): string[] {
  const messages: string[] = [];
  const metaProps = metadata ?? [];
  const metaByName = new Map(metaProps.map((prop) => [prop.name, prop]));
  const extractedByName = new Map(extracted.map((prop) => [prop.name, prop]));

  for (const prop of extracted) {
    if (!metaByName.has(prop.name)) {
      messages.push(`missing prop: ${prop.name}`);
    }
  }
  for (const prop of metaProps) {
    if (!extractedByName.has(prop.name)) {
      messages.push(`extra prop: ${prop.name}`);
    }
  }

  for (const extractedProp of extracted) {
    const metaProp = metaByName.get(extractedProp.name);
    if (!metaProp) continue;
    if (metaProp.required !== extractedProp.required) {
      messages.push(
        `required mismatch: ${extractedProp.name} (metadata ${metaProp.required}, component ${extractedProp.required})`,
      );
    }
    if (normalizeTypeText(metaProp.type) !== normalizeTypeText(extractedProp.type)) {
      messages.push(
        `type mismatch: ${extractedProp.name} (metadata "${metaProp.type}", component "${extractedProp.type}")`,
      );
    }
    if (extractedProp.default !== undefined) {
      const metaDefault = normalizeDefault(metaProp.default);
      const componentDefault = normalizeDefault(extractedProp.default);
      if (metaDefault !== componentDefault) {
        messages.push(
          `default mismatch: ${extractedProp.name} (metadata ${metaProp.default === undefined ? '(missing)' : `"${metaProp.default}"`}, component "${extractedProp.default}")`,
        );
      }
    }
  }

  return messages;
}

function compareBarrel(diskNames: string[]): string[] {
  const barrelNames = ALL_COMPONENT_METADATA.map((meta) => meta.component.name);
  const disk = new Set(diskNames);
  const barrel = new Set(barrelNames);
  const messages: string[] = [];

  for (const name of diskNames) {
    if (!barrel.has(name)) {
      messages.push(`missing from ALL_COMPONENT_METADATA: ${name}`);
    }
  }
  for (const name of barrelNames) {
    if (!disk.has(name)) {
      messages.push(`extra in ALL_COMPONENT_METADATA: ${name}`);
    }
  }
  if (barrelNames.length !== new Set(barrelNames).size) {
    messages.push('ALL_COMPONENT_METADATA has duplicate component.name entries');
  }
  return messages;
}

async function main(): Promise<void> {
  const metadataFiles = findMetadataFiles(UI_LIB_PATH);
  if (metadataFiles.length === 0) {
    console.error(`No metadata files under ${COMPONENT_METADATA_GLOB}`);
    process.exit(1);
  }

  const compilerOptions = loadCompilerOptions();
  const findings: Finding[] = [];
  const diskNames: string[] = [];

  for (const absPath of metadataFiles) {
    const relative = toPosix(path.relative(WORKSPACE_ROOT, absPath));
    const metadata = await importMetadata(absPath);
    diskNames.push(metadata.component.name);

    const componentAbs = path.join(WORKSPACE_ROOT, metadata.component.path);
    const isComponentTs =
      metadata.component.path.endsWith('.component.ts') &&
      fs.existsSync(componentAbs);

    let messages: string[];
    if (!isComponentTs) {
      const props = metadata.props ?? [];
      messages =
        props.length === 0 && metadata.props
          ? []
          : ['CSS-only block must declare props: []'];
    } else {
      const extracted = extractPublicApi(componentAbs, compilerOptions);
      messages = compareProps(metadata.props, extracted);
    }

    if (messages.length) {
      findings.push({
        component: metadata.component.name,
        file: relative,
        messages,
      });
    }
  }

  const barrelMessages = compareBarrel(diskNames);
  if (barrelMessages.length) {
    findings.push({
      component: 'ALL_COMPONENT_METADATA',
      file: 'libs/ui/src/storybook/component-metadata.ts',
      messages: barrelMessages,
    });
  }

  if (findings.length === 0) {
    console.log(
      `✅ contracts:check — ${metadataFiles.length} metadata files match Angular inputs`,
    );
    return;
  }

  console.error('❌ contracts:check found metadata props drift:\n');
  for (const finding of findings) {
    console.error(`${finding.component} (${finding.file})`);
    for (const message of finding.messages) {
      console.error(`  - ${message}`);
    }
    console.error('');
  }
  process.exit(1);
}

void main();
