// Compatibility command: the inventory, registry, schemas and exports are one generation pass.
import { generateContracts } from '../contracts/generate';

generateContracts().then(files => console.log(`Contracts: ${files.length} artifact(s) updated.`)).catch(error => { console.error(error); process.exitCode = 1; });
