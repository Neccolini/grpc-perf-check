use tonic::{transport::Server, Request, Response, Status};
use std::net::SocketAddr;
use sha2::{Sha512, Digest};

use hello_world::greeter_server::{Greeter, GreeterServer};
use hello_world::{HelloReply, HelloRequest, CalcReply, CalcRequest};

pub mod hello_world {
    tonic::include_proto!("helloworld");
}

#[derive(Default)]
pub struct MyGreeter {}

#[tonic::async_trait]
impl Greeter for MyGreeter {
    async fn say_hello(
        &self,
        _request: Request<HelloRequest>,
    ) -> Result<Response<HelloReply>, Status> {
        let reply = hello_world::HelloReply {
            message: "Hello".to_string(),
        };
        Ok(Response::new(reply))
    }
    async fn calc(
        &self,
        request: Request<CalcRequest>,
    ) -> Result<Response<CalcReply>, Status> {
        let mut hasher = Sha512::new();
        hasher.update(request.into_inner().password);
        let result = hasher.finalize()[0] as i32;

        let reply = hello_world::CalcReply {
            result,
        };
        Ok(Response::new(reply))
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let addr: SocketAddr = "127.0.0.1:50052".parse()?;
    let greeter = MyGreeter::default();
    println!("server listening at {}:{}", &addr.ip(), &addr.port());
    Server::builder()
        .add_service(GreeterServer::new(greeter))
        .serve(addr)
        .await?;

    Ok(())
}
