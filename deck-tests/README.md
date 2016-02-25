## Browser tests for Spinnaker

### Install Dependencies 

```
npm install
```

### Configure Options at the top of `tests.js`

set `host` variable for the address of spinnaker and `gate` variable for gate address.

Set the `headless` variable to true or false. If running on jenkins ensure it is false.

### Run tests
```
mocha tests.js
```