# KENOLO ![KENOLO](https://cdn3.iconfinder.com/data/icons/google-material-design-icons/48/ic_thumbs_up_down_48px-24.png)

## A lightweight JSON-based business rules engine
[![npm version](https://badge.fury.io/js/kenolo.svg)](https://badge.fury.io/js/kenolo)

### Consider Using KENOLO, If:
- You want non-programmers to be able to understand and modify the rules themselves  
_KENOLO ruleset is simple yet powerful thanks to the operators which are supported_
- You need to apply different rules and conditions per environment  
_Use npm configuration packages, such as [config](https://www.npmjs.com/package/config) or [nconf](https://www.npmjs.com/package/nconf), to store your ruleset per environment_.
- Rules are frequently changed, but you strive to keep source code modifications and consequently tedious QA cycles to the minimum  
_Simply modify an external JSON file to update your ruleset_.
- Security, size & performance concern you  
_KENOLO is a 22KB `eval`-free npm package_.

### Installation
`npm i kenolo -S`

### Ruleset Structure
```javascript
{
  "NAME_OF_RULE_1": {
    // mandatory - object of one or more conditions to check whether rule should apply:
    "include":
      // condition 1:
      { "name": "CONDITION_NAME", "property": "PROPERTY_PATH_TO_EXTRACT_DATA_FROM", "operator": "eq", "value": "VALUE_TO_COMPARE_WITH" },
    // optional - object of one or more conditions to check whether rule should NOT apply:
    "exclude": {
      // array of conditions which should all be truthy for rule to apply:
      "and": [
        // condition 1:
        { "name": "CONDITION_NAME", "property": "PROPERTY_PATH_TO_EXTRACT_DATA_FROM", "operator": "gt", "value": "VALUE_TO_COMPARE_WITH" },
        // condition 2:
        { "name": "CONDITION_NAME", "property": "PROPERTY_PATH_TO_EXTRACT_DATA_FROM", "operator": "neq", "value": "VALUE_TO_COMPARE_WITH" },
        // more conditions:
        //...
      ],
      // array of conditions from which at least one of them should be truthy for rule to apply:
      "or": [
        // condition 1:
        { "name": "CONDITION_NAME", "property": "PROPERTY_PATH_TO_EXTRACT_DATA_FROM", "operator": "eq", "value": "VALUE_TO_COMPARE_WITH" },
        // condition 2:
        { "name": "CONDITION_NAME", "property": "PROPERTY_PATH_TO_EXTRACT_DATA_FROM", "operator": "eq", "value": "VALUE_TO_COMPARE_WITH" },
        // more conditions:
        //...
      ]
    }
  },
  "NAME_OF_RULE_2": {
    "include": [
      // ...
    ]
  }
}
```

### Basic Example
```javascript
const kenolo = require('kenolo');

const data = {
  order: {
    status: 2,
    user: {
      email: 'danger@hotmail.com'
    }
  }
};

const SHOULD_REVIEW = {
  include: {
    and: [
      { name: 'STATUS_PENDING', property: 'order.status', operator: 'eq', value: 2 },
      {
        or: [
          { name: 'HIGH_RISK_USER_EMAILS', property: 'order.user.email', operator: 'in', value: ['danger@hotmail.com', 'omg@hacked.com'] },
          { name: 'MAX_PRICE_EXCEEDED', property: 'order.price', operator: 'gt', value: 500 }
        ]
      }
    ]
  }
};

kenolo(SHOULD_REVIEW, data);
// -> { apply: true, conditions: [ 'STATUS_PENDING', 'HIGH_RISK_USER_EMAILS' ] }
```

See tests directory for more examples

### Response Object
```javascript
{
  // {Boolean} apply - Should rule apply?
  apply: true,
  // {String[]} conditions - Truthy condition names
  conditions: ['CONDITION_NAME_1', 'CONDITION_NAME_2']
}
```

### Supported Operators
- **`eq`** - Equal to (a single value)  
`{ "property": "a", "operator": "eq", "value": "a" }`  

- **`weq`** - Weak equal to (a single value)  
`{ "property": "2", "operator": "weq", "value": 2 }`  

- **`neq`** - Not equal to (a single value)  
`{ "property": "a", "operator": "neq", "value": "b" }`  

- **`in`** - In (an array of values)  
`{ "property": "a", "operator": "in", "value": ["a", "b", "c"] }`  

- **`nin`** - Not in (an array of values)  
`{ "property": "d", "operator": "nin", "value": ["a", "b", "c"] }`  

- **`gt`** - Greater than (a single value)  
`{ "property": 100, "operator": "gt", "value": 80 }`  

- **`gte`** - Greater than or equal to (a single value)  
`{ "property": 100, "operator": "gte", "value": 100 }`  

- **`lt`** - Lower than (a single value)  
`{ "property": 100, "operator": "lt", "value": 120 }`  

- **`lte`** - Lower than or equal to (a single value)  
`{ "property": 100, "operator": "lte", "value": 100 }`  

- **`sw`** - Starts with (an array of values)  
`{ "property": "+1 40 9871625", "operator": "sw", "value": ["+1", "+40"] }`  

- **`ew`** - Ends with (an array of values)  
`{ "property": "danger@hacker.com", "operator": "ew", "value": ["@hacker.com", "@hazard.com"] }`  

- **`sl`** - Sounds like (an array of values)  
`{ "property": "John", "operator": "sl", "value": ["Jon", "David"] }`  

- **`inc`** - Includes (an array of values)  
`{ "property": "John", "operator": "inc", "value": ["oh", "bla"] }`  

- **`re`** - Regular expression (an array of values)  
`{ "property": "New York", "operator": "re", "value": [/New/i] }`  
`{ "property": "New York", "operator": "re", "value": ["\\w+"] }`  
