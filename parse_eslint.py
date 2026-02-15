import json
import try:
    with open('eslint_results.json', 'r') as f:
        data = json.load(f)
    for file in data:
        if file['errorCount'] > 0:
            print(f"File: {file['filePath']}")
            for msg in file['messages']:
                if msg['severity'] == 2:
                    print(f"  Line {msg['line']}: {msg['message']} ({msg['ruleId']})")
except Exception as e:
    print(f"Error: {e}")
