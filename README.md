# Solidaris Monorepo

Welcome to the Solidaris Monorepo! This repository is an Angular CLI multi-project workspace containing two Angular applications, iSHARE and iCRM, built using the latest technologies and design systems.

## Project Structure

The project is organized into the following main directories:

- **apps/**: Contains the Angular applications.
  - **ishare/**: The iSHARE application.
  - **icrm/**: The iCRM application.
  
- **libs/**: Contains shared libraries and styles.
  - **ui/**: UI components and services.
  - **styles/**: SCSS styles organized using ITCSS.
  - **plectrum/**: Plectrum design system components and tokens.

- **storybook/**: Contains Storybook configuration and stories for UI components.

- **tools/**: Custom generators for streamlining development.

- **.ai/**: Contains AI-related files, including skills and rules for UI design agents.

## Technologies Used

- **Angular**: The latest version for building the applications.
- **PrimeNG**: A rich set of UI components for Angular.
- **SCSS**: Organized using ITCSS methodology.
- **BEMIT**: Naming convention for CSS classes.
- **Plectrum Design System**: A design system for consistent UI elements.
- **Storybook**: For developing and showcasing UI components in isolation.

## Getting Started

To get started with the project, follow these steps:

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd solidaris-nx
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Run the applications:
   - For iSHARE:
     ```
     npm start
     ```
   - For iCRM:
     ```
     npm run start:icrm
     ```

5. Open Storybook:
   ```
   npm run storybook
   ```

## Contributing

Contributions are welcome! Please follow the guidelines in the `.ai/README.md` knowledge base (rules, skills, and contracts) for project management and development practices.

## License

This project is licensed under the MIT License. See the LICENSE file for details.