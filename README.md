# NestJS Spellchecker API

This API is developed using NestJS.

**Deployed Project Link:** https://outdefine-spellchecker-api.onrender.com

## Installation

1. Clone the repository to your local machine

```bash
git clone https://github.com/Jsebas1198/Outdefine-test-server.git
```

2. Navigate to the project directory.

3. Install dependencies using the following command:

```bash
npm install
```

## Configuration

There is no additional configuration required for this app. Ensure that the **assets/dictionary.txt** file is available for spellchecking.

## Execution

Once you have completed the installation and configuration, you can run the application locally using the following command:

```bash
npm run start:dev
```

This will start the NestJS application in your local development environment. The API will be accessible at http://localhost:31337/.

### Spellchecking Endpoint:
- Endpoint: /spell/:word
- Example: http://localhost:3000/spell/word