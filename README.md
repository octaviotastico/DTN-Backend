# DTN-Backend
A backend to connect DTN Apps with the DTN Network.

### Term_1: CMS Back 1
```
yarn start --http-port 2424 --tcp-port 2525 --dtn-port 7474
```

### Term 2: DTN Back 1
```
yarn start --tcp-port 7474 --cms-port 2525 --dtn-port 4242
```

### Term 3: CMS Back 2
```
yarn start --http-port 2626 --tcp-port 2727 --dtn-port 7575
```

### Term 4: DTN Back 2
```
yarn start --tcp-port 7575 --cms-port 2727 --dtn-port 4243
```
