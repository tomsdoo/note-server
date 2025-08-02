# note-server

http server

``` sh
npm run dev
```

``` sh
docker run -it --rm -p 3000:3000 -v ./data:/usr/local/data tomsd/note-server:0.1.0
```

``` sh
docker run -it --rm -p 3001:3001 -e PORT=3001 -v ./data:/usr/local/data tomsd/note-server:0.1.0
```

