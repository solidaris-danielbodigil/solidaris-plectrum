import { IconRegistry } from '@solidaris/ui';

const SVG_ICRM = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="logo/solidaris/icrm">
<g id="Calque_4" clip-path="url(#clip0_18_7344)">
<path id="Vector" d="M10.843 16.0443C15.2616 16.0443 18 12.1334 18 7.81622C18 3.49909 14.4186 0 10 0C5.58136 0 2 3.49909 2 7.81622C2 9.12453 2.20932 11.9877 4.10466 13.988C6.36416 16.9323 12.6896 21.073 13.3663 19.7479C13.7878 18.9242 9.76201 16.0443 10.8401 16.0443H10.843ZM9.91971 10.8335C8.11326 10.8335 6.64803 9.40188 6.64803 7.63692C6.64803 5.87197 8.11326 4.4404 9.91971 4.4404C11.7262 4.4404 13.1914 5.87197 13.1914 7.63692C13.1914 9.40188 11.7262 10.8335 9.91971 10.8335Z" fill="url(#paint0_linear_18_7344)"/>
</g>
</g>
<defs>
<linearGradient id="paint0_linear_18_7344" x1="-1.20574" y1="0.983331" x2="17.6184" y2="14.4096" gradientUnits="userSpaceOnUse">
<stop stop-color="#FF1D25"/>
<stop offset="1" stop-color="#D4145A"/>
</linearGradient>
<clipPath id="clip0_18_7344">
<rect width="16" height="20" fill="white" transform="translate(2)"/>
</clipPath>
</defs>
</svg>`;

const SVG_ISHARE = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="logo/solidaris/ishare">
<g id="Calque_2" clip-path="url(#clip0_56_345)">
<path id="Vector" d="M0.0976334 3.04906L4.61055 7.71987L8.80002 16.1969C8.80002 16.1969 9.3072 17.7839 10.3713 16.4985C11.4354 15.2131 19.8603 5.28936 19.8603 5.28936C19.8603 5.28936 20.4383 4.1596 19.2287 3.94441C18.0192 3.72922 0.633518 2 0.633518 2C0.633518 2 -0.296625 2.23248 0.0976334 3.04906Z" fill="url(#paint0_linear_56_345)"/>
<path id="Vector_2" d="M2.90535 12.4445C2.90535 12.4445 2.50727 12.1332 2.59722 11.3628C2.68717 10.5923 3.37617 6.46525 3.37617 6.46525L15.3838 5.21637C15.3838 5.21637 15.9063 5.38353 15.4987 5.78509L5.11014 8.5307L2.90535 12.4426V12.4445Z" fill="url(#paint1_linear_56_345)"/>
<path id="Vector_3" d="M5.08713 8.57489L2.82876 11.9968C2.82876 11.9968 2.66416 12.3196 2.90531 12.4445L6.50914 11.5511L5.08713 8.57681V8.57489Z" fill="#662D91"/>
</g>
</g>
<defs>
<linearGradient id="paint0_linear_56_345" x1="-0.550763" y1="0.309995" x2="32.3962" y2="22.4813" gradientUnits="userSpaceOnUse">
<stop stop-color="#FF1568"/>
<stop offset="1" stop-color="#D04521"/>
</linearGradient>
<linearGradient id="paint1_linear_56_345" x1="2.58382" y1="8.83043" x2="27.6594" y2="8.83043" gradientUnits="userSpaceOnUse">
<stop stop-color="#9E005D"/>
<stop offset="1" stop-color="#ED1E79"/>
</linearGradient>
<clipPath id="clip0_56_345">
<rect width="20" height="15" fill="white" transform="translate(0 2)"/>
</clipPath>
</defs>
</svg>`;

export function registerIshareIcons(iconRegistry: IconRegistry): void {
  iconRegistry.register('logo-icrm', SVG_ICRM);
  iconRegistry.register('logo-ishare', SVG_ISHARE);
}