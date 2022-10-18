# gRPCの速度比較(Go, Rust, Python)
## 構成
### フロントエンド
* Typescript
### バックエンド
* Go
* Rust
* Python

## proto ファイル生成
### Typescript
```
$ npm run codegen
```
### Go
```
$ bash proto.sh
```
### Rust
```
cargo buildで自動的に生成される
```
### Python
```
$ python3 -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. ./proto/pf.proto
```
