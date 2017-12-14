# KENOLO

## Basic Business Rules Engine
Kenolo is a lightweight rules engine, which checks if a rule applies to a data object based on a set of human readable conditions.

### Pros
- Easy to Use - JSON-based conditions file
- Secure & Fast - No use of eval()
- Lightweight

### Installation
`npm i kenolo -S`

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

const rule = {
  include: {
    and: [
      { name: 'STATUS_PENDING', property: 'order.status', operator: 'eq', value: 2 },
      {
        or: [
          { name: 'HIGH_RISK_USER_EMAILS', property: 'order.user.email', operator: 'in', value: ['danger@hotmail.com', 'omg@hacked.com'] },
        ]
      }
    ]
  }
};

kenolo(rule, data);
// -> { decision: true, conditions: [ 'STATUS_PENDING', 'HIGH_RISK_USER_EMAILS' ] }
```

See tests directory for more examples

### Supported Operators
- `eq` - Equal to (a single value)
- `weq` - (Weak) Equal to (a single value)
- `neq` - Not equal to (a single value)
- `in` - In (an array of values)
- `nin` - Not in (an array of values)
- `gt` - Greater than (a single value)
- `gte` - Greater than or equal to (a single value)
- `lt` - Lower than (a single value)
- `lte` - Lower than or equal to (a single value)
- `gt` - Greater than (a single value)
- `sw` - Starts with (an array of values)
- `ew` - Ends with (an array of values)