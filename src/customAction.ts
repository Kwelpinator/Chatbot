import path from "path";
import { getRandomFolder } from './Utils/getFolder'

export async function getEntityFromInput(input: string, regex: string | string[]): Promise<string | undefined> {
    let match: string | undefined = undefined;

    if (Array.isArray(regex)) {
        for (let i = 0; i < regex.length; i++) {
            const regexPattern = new RegExp(regex[i], 'i');
            const result = input.match(regexPattern);
            if (result && result[1]) {
                match = result[1].trim();
                break;
            }
        }
    } else if (typeof regex === 'string') {
        const regexPattern = new RegExp(regex, 'i');
        const result = input.match(regexPattern);
        if (result && result[1]) {
            match = result[1].trim();
        }
    }

    return match;
}

export async function executeCustomAction(actionName: string, value: string | undefined): Promise<{ answer: string }> {
    const customActionFolderPath = path.join(__dirname, 'CustomAction');
    const randomFolder = getRandomFolder(customActionFolderPath);
    const filePath = path.join(customActionFolderPath, randomFolder, 'main.ts');

    try {
        const customAction = await import(filePath);
        if (typeof customAction.default === 'function') {
            return await customAction.default(actionName, value);
        }
    } catch (error) {
        console.error(`Error executing custom action:`, error);
    }

    // Return an empty string if the custom action is not found or encounters an error. If this happen = skill issue
    return { answer: '' };
}
