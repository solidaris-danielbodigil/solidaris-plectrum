import type { ArgTypes } from 'storybook/internal/csf';
import {
  argTypesFromProps,
  classArgTypes,
  isOutputProp,
  literalUnionOptions,
  normalizeType,
  type StoryArgType,
} from './arg-types-from-props';

/** Storybook's `ArgTypes` marks every field optional; the helper always fills them. */
function row(argTypes: ArgTypes, name: string): StoryArgType {
  return argTypes[name] as StoryArgType;
}

function controlFor(
  type: string,
  extra: Partial<{ default: string; required: boolean }> = {},
): StoryArgType['control'] {
  return row(
    argTypesFromProps([
      {
        name: 'prop',
        type,
        required: extra.required ?? false,
        default: extra.default,
        description: `Typed ${type}.`,
      },
    ]),
    'prop',
  ).control;
}

describe('argTypesFromProps', () => {
  it('fills description, type, default, and a text control', () => {
    const argTypes = argTypesFromProps([
      {
        name: 'label',
        type: 'string',
        required: true,
        description: 'Visible label.',
      },
    ]);

    expect(argTypes['label']).toEqual(
      jasmine.objectContaining({
        description: 'Visible label.',
        control: { type: 'text' },
        table: {
          category: 'Inputs',
          type: { summary: 'string' },
          defaultValue: { summary: 'required' },
        },
      }),
    );
  });

  it('keeps declared defaults and boolean controls', () => {
    const argTypes = argTypesFromProps([
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        default: 'false',
        description: 'Disables the control.',
      },
    ]);

    expect(argTypes['disabled'].control).toEqual({ type: 'boolean' });
    expect(row(argTypes, 'disabled').table.defaultValue).toEqual({
      summary: 'false',
    });
  });

  it('treats outputs as control-less API rows', () => {
    const copied = {
      name: 'copied',
      type: 'output<string>',
      required: false,
      description: 'Emitted after a successful copy.',
    };
    expect(isOutputProp(copied)).toBe(true);
    expect(argTypesFromProps([copied])['copied'].control).toBe(false);
    expect(row(argTypesFromProps([copied]), 'copied').table.category).toBe(
      'Outputs',
    );
  });

  it('merges per-prop extras for select options', () => {
    const argTypes = argTypesFromProps(
      [
        {
          name: 'layout',
          type: "'vertical' | 'horizontal'",
          required: false,
          default: 'vertical',
          description: 'Label placement.',
        },
      ],
      { layout: { control: 'radio', options: ['vertical', 'horizontal'] } },
    );

    expect(argTypes['layout'].control).toEqual({ type: 'radio' });
    expect(argTypes['layout'].options).toEqual(['vertical', 'horizontal']);
  });

  describe('type → control mapping', () => {
    it('unwraps model<boolean> and nullable booleans to a boolean control', () => {
      expect(controlFor('model<boolean>', { default: 'false' })).toEqual({
        type: 'boolean',
      });
      expect(controlFor('boolean | undefined')).toEqual({ type: 'boolean' });
      expect(controlFor('InputSignal<boolean>')).toEqual({ type: 'boolean' });
    });

    it('keeps the Models category for model<> props', () => {
      const argTypes = argTypesFromProps([
        {
          name: 'visible',
          type: 'model<boolean>',
          required: false,
          default: 'false',
          description: 'Two-way visibility.',
        },
      ]);
      expect(row(argTypes, 'visible').table.category).toBe('Models');
      expect(argTypes['visible'].control).toEqual({ type: 'boolean' });
    });

    it('maps model<string> and nullable strings to a text control', () => {
      expect(controlFor('model<string>')).toEqual({ type: 'text' });
      expect(controlFor('string | null', { default: 'null' })).toEqual({
        type: 'text',
      });
      expect(controlFor('string | undefined')).toEqual({ type: 'text' });
    });

    it('maps numbers, including nullable ones, to a number control', () => {
      expect(controlFor('number | null', { default: 'null' })).toEqual({
        type: 'number',
      });
    });

    it('maps arrays and generic structural types to an object editor', () => {
      expect(controlFor('MenuItem[]', { required: true })).toEqual({
        type: 'object',
      });
      expect(controlFor('ListGroup[] | null', { default: 'null' })).toEqual({
        type: 'object',
      });
      expect(controlFor('string[]', { default: '[]' })).toEqual({
        type: 'object',
      });
      expect(controlFor('Array<string>')).toEqual({ type: 'object' });
      expect(controlFor('Partial<ProfileDrawerLabelSet>')).toEqual({
        type: 'object',
      });
      expect(controlFor("Record<'a' | 'b', string>")).toEqual({
        type: 'object',
      });
      expect(controlFor('{ doc: string; tag: string }')).toEqual({
        type: 'object',
      });
    });

    it('maps interface-like named types to an object editor', () => {
      expect(controlFor('ProfileDrawerData', { required: true })).toEqual({
        type: 'object',
      });
      expect(controlFor('ProfileDrawerLabels', { default: '{}' })).toEqual({
        type: 'object',
      });
      expect(
        controlFor('ProfileCardStatusAction | null', { default: 'null' }),
      ).toEqual({ type: 'object' });
      expect(controlFor('MenuItem | null', { default: 'null' })).toEqual({
        type: 'object',
      });
    });

    it('keeps scalar type aliases with a scalar default on a text control', () => {
      expect(controlFor('DrawerPosition', { default: 'right' })).toEqual({
        type: 'text',
      });
      expect(controlFor('IconSize', { default: 'md' })).toEqual({
        type: 'text',
      });
      expect(
        controlFor('PlectrumAvatarColor | null', { default: 'null' }),
      ).toEqual({ type: 'text' });
    });

    it('maps unions of string literals to a select with the literals as options', () => {
      const argTypes = argTypesFromProps([
        {
          name: 'layout',
          type: "'vertical' | 'horizontal'",
          required: false,
          default: 'vertical',
          description: 'Label placement.',
        },
      ]);
      expect(argTypes['layout'].control).toEqual({ type: 'select' });
      expect(argTypes['layout'].options).toEqual(['vertical', 'horizontal']);
      expect(controlFor("'a' | 'b' | undefined")).toEqual({ type: 'select' });
      expect(controlFor('model<"left" | "right">')).toEqual({
        type: 'select',
      });
    });

    it('disables controls for output<…> props regardless of the inner type', () => {
      expect(controlFor('output<void>')).toBe(false);
      expect(controlFor('output<boolean>')).toBe(false);
      expect(controlFor('output<ProfileDrawerIdentifier>')).toBe(false);
    });
  });
});

describe('normalizeType', () => {
  it('strips signal wrappers and nullable members', () => {
    expect(normalizeType('model<boolean>')).toBe('boolean');
    expect(normalizeType('string | null | undefined')).toBe('string');
    expect(normalizeType("Record<'a' | 'b', X> | null")).toBe(
      "Record<'a' | 'b', X>",
    );
  });
});

describe('literalUnionOptions', () => {
  it('returns the literal values for a pure string-literal union', () => {
    expect(literalUnionOptions("'left' | 'right' | undefined")).toEqual([
      'left',
      'right',
    ]);
  });

  it('returns undefined for single types and mixed unions', () => {
    expect(literalUnionOptions('string')).toBeUndefined();
    expect(literalUnionOptions("'left' | string")).toBeUndefined();
    expect(literalUnionOptions('MenuItem | null')).toBeUndefined();
  });
});

describe('classArgTypes', () => {
  it('documents BEM classes without Controls knobs', () => {
    const argTypes = classArgTypes([
      {
        name: '.c-drawer__header',
        description: 'Header row.',
      },
    ]);

    expect(argTypes['.c-drawer__header'].control).toBe(false);
    expect(row(argTypes, '.c-drawer__header').table.category).toBe('Classes');
    expect(row(argTypes, '.c-drawer__header').table.type.summary).toBe(
      'class',
    );
    expect(argTypes['.c-drawer__header'].description).toBe('Header row.');
  });
});
