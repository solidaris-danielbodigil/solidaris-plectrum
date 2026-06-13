import { describeClickTarget, resolveClickTarget } from './describe-click-target';

describe('describeClickTarget', () => {
  it('should prefer data-telemetry-id on an ancestor element', () => {
    const link = document.createElement('a');
    link.setAttribute('data-telemetry-id', 'session-export');
    const label = document.createElement('span');
    label.textContent = 'Exporter les données';
    link.appendChild(label);
    document.body.appendChild(link);

    expect(describeClickTarget(label)).toBe('session-export');
    expect(resolveClickTarget(label)).toEqual({
      id: 'session-export',
      label: 'Exporter les données',
    });

    link.remove();
  });

  it('should capture data-test as label while keeping telemetry id stable', () => {
    const button = document.createElement('button');
    button.setAttribute('data-telemetry-id', 'journey-view');
    button.setAttribute('data-test', 'Vue parcours');
    document.body.appendChild(button);

    expect(resolveClickTarget(button)).toEqual({
      id: 'journey-view',
      label: 'Vue parcours',
    });

    button.remove();
  });

  it('should resolve nested data-test from an ancestor', () => {
    const link = document.createElement('a');
    link.setAttribute('data-telemetry-id', 'session-start');
    link.setAttribute('data-test', 'Démarrer la session test');
    const label = document.createElement('span');
    label.textContent = 'Démarrer la session test';
    link.appendChild(label);
    document.body.appendChild(link);

    expect(resolveClickTarget(label)).toEqual({
      id: 'session-start',
      label: 'Démarrer la session test',
    });

    link.remove();
  });

  it('should capture aria-label as human label with tag id fallback', () => {
    const button = document.createElement('button');
    button.setAttribute('aria-label', 'Filtre secteur');
    document.body.appendChild(button);

    expect(describeClickTarget(button)).toBe('button');
    expect(resolveClickTarget(button)).toEqual({
      id: 'button',
      label: 'Filtre secteur',
    });

    button.remove();
  });

  it('should capture title as human label with tag id fallback', () => {
    const button = document.createElement('button');
    button.setAttribute('title', 'Vue parcours');
    document.body.appendChild(button);

    expect(describeClickTarget(button)).toBe('button');
    expect(resolveClickTarget(button)).toEqual({
      id: 'button',
      label: 'Vue parcours',
    });

    button.remove();
  });

  it('should capture meaningful text content as label on links', () => {
    const link = document.createElement('a');
    const label = document.createElement('span');
    label.textContent = 'Nouvelle session';
    link.appendChild(label);
    document.body.appendChild(link);

    expect(describeClickTarget(label)).toBe('a');
    expect(resolveClickTarget(label)).toEqual({
      id: 'a',
      label: 'Nouvelle session',
    });

    link.remove();
  });

  it('should resolve PrimeNG button label text', () => {
    const host = document.createElement('p-button');
    const label = document.createElement('span');
    label.className = 'p-button-label';
    label.textContent = 'Etape suivante';
    host.appendChild(label);
    document.body.appendChild(host);

    expect(resolveClickTarget(label)).toEqual({
      id: 'p-button',
      label: 'Etape suivante',
    });

    host.remove();
  });

  it('should resolve input placeholder and associated label', () => {
    const label = document.createElement('label');
    label.htmlFor = 'document-search';
    label.textContent = 'Rechercher';
    const input = document.createElement('input');
    input.id = 'document-search';
    input.setAttribute('placeholder', 'Rechercher document...');
    document.body.append(label, input);

    expect(resolveClickTarget(input)).toEqual({
      id: 'document-search',
      label: 'Rechercher',
    });

    label.remove();
    input.remove();
  });

  it('should resolve svg path clicks to parent button label', () => {
    const button = document.createElement('button');
    button.setAttribute('aria-label', 'Document suivant');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    svg.appendChild(path);
    button.appendChild(svg);
    document.body.appendChild(button);

    expect(resolveClickTarget(path)).toEqual({
      id: 'button',
      label: 'Document suivant',
    });

    button.remove();
  });

  it('should read accordion header text for section clicks', () => {
    const header = document.createElement('p-accordion-header');
    header.textContent = 'Certificat ITT';
    const icon = document.createElement('i');
    header.appendChild(icon);
    document.body.appendChild(header);

    expect(resolveClickTarget(icon)).toEqual({
      id: 'p-accordion-header',
      label: 'Certificat ITT',
    });

    header.remove();
  });

  it('should ignore pn_id internal ids', () => {
    const button = document.createElement('button');
    button.id = 'pn_id_42';
    button.textContent = 'Continuer';
    document.body.appendChild(button);

    expect(resolveClickTarget(button)).toEqual({
      id: 'button',
      label: 'Continuer',
    });

    button.remove();
  });

  it('should fall back to tag name when no better identifier exists', () => {
    const span = document.createElement('span');
    document.body.appendChild(span);

    expect(describeClickTarget(span)).toBe('span');
    expect(resolveClickTarget(span)).toEqual({ id: 'span' });

    span.remove();
  });
});
