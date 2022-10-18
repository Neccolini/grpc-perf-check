# gRPCの速度比較(Go, Rust, Python)
## 構成
### フロントエンド
* Typescript
### バックエンド
* Go
* Rust
* Python

## proto ファイル生成
### Go
```
bash proto.sh
```
### Rust
```
cargo buildで自動的に生成される
```
### Python
```
python3 -m grpc_tools.protoc -I. --python_out=. --grpc_python
_out=. ./proto/pf.proto
```
