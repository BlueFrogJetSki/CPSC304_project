export function validateCondition(inputString: string, validColumns:string[]): string | false {
   
    const conditionRegex: RegExp = /^([a-zA-Z0-9_]+)\s*=\s*'([a-zA-Z0-9_ ]+)'$/; // Regex to match conditions like column = 'value'
    const sanitizedConditions: string[] = [];

    // Split by 'OR' or 'AND' to separate the conditions
    const conditions: string[] = inputString.split(/\s+(OR|AND)\s+/i);
    console.log(`split by OR, AND ${conditions}`)

    for (let condition of conditions) {
        // Trim spaces
        condition = condition.trim();

        // Match condition format: column = 'value'
        const match = condition.match(conditionRegex);
        if (match) {
            const column: string = match[1];
            const value: string = match[2];

            // Validate column name
            if (validColumns.includes(column)) {
                sanitizedConditions.push(`${column} = '${value}'`);
            } else {
                console.error(`Invalid column: ${column}`);
                return false; // Invalid column found
            }
        } else {
            console.error(`Invalid condition format: ${condition}`);
            return false; // Invalid condition format
        }
    }

    // Return the validated and sanitized condition string
    return sanitizedConditions.join(' OR ');
}


