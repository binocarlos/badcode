// mp4box ships no type declarations. @badcode/comic's VideoSource imports it and
// interacts via `any` casts at the boundary; this ambient declaration lets the web
// app's typecheck resolve the import (the comic package has its own copy in globals.d.ts).
declare module 'mp4box'
