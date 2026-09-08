import {
  argTypesFromProps,
  classArgTypes,
  isOutputProp,
} from './arg-types-from-props';

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
    expect(argTypes['disabled'].table.defaultValue).toEqual({
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
    expect(argTypesFromProps([copied])['copied'].table.category).toBe(
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
    expect(argTypes['.c-drawer__header'].table.category).toBe('Classes');
    expect(argTypes['.c-drawer__header'].table.type.summary).toBe('class');
    expect(argTypes['.c-drawer__header'].description).toBe('Header row.');
  });
});
