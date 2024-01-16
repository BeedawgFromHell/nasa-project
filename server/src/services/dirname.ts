import * as path from 'path';

export default function dirname(
    moduleUrl: string
): string {
    return path.dirname(moduleUrl);
}