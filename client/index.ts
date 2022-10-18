import * as grpc from '@grpc/grpc-js'

import { GreeterClient } from './proto/pf_grpc_pb';
import { CalcRequest, CalcReply, HelloRequest, HelloReply } from './proto/pf_pb';

async function req(message: string, port: number): Promise<HelloReply> {
    const client = new GreeterClient(
        `localhost:${port}`,
        grpc.credentials.createInsecure(),
    );

    // HelloRequestを作るためのクラス、メソッドが用意されているのでそれを用いてメッセージを作成する
    const request = new HelloRequest();
    request.setName(message);
    // サーバに対してサービスの実行を要求する
    return new Promise<HelloReply>((resolve, reject) => {
        // console.log("Send Request Message");
        client.sayHello(request, (err, response) => {
            if (err) {
                console.log("err occured", err);
                return reject(err);
            }
            // ここで結果を受け取っている
            // console.log("R");
            return resolve(response!!);
        });
    });
}


async function req2(message: string, port: number): Promise<CalcReply> {
    const client = new GreeterClient(
        `localhost:${port}`,
        grpc.credentials.createInsecure(),
    );

    // HelloRequestを作るためのクラス、メソッドが用意されているのでそれを用いてメッセージを作成する
    const request = new CalcRequest();
    request.setPassword(message);
    // サーバに対してサービスの実行を要求する
    return new Promise<CalcReply>((resolve, reject) => {
        // console.log("Send Request Message");
        client.calc(request, (err, response) => {
            if (err) {
                console.log("err occured", err);
                return reject(err);
            }
            // ここで結果を受け取っている
            // console.log("R");
            return resolve(response!!);
        });
    });
}

async function hello(port: number) {
    const iter = 1000;
    let sum = 0;
    for (let i = 0; i < iter; i++) {
        sum += await (async () => {
            const startTime = performance.now();
            const _ = await req(String(i), port);
            const endTime = performance.now();
            return endTime - startTime;
        })();
    }
    console.log("hello: elapsed time [ms]: ", sum);
}

async function calc(port: number) {
    const iter = 500;
    let sum = 0;
    for (let i = 0; i < iter; i++) {
        sum += await (async () => {
            const test_string = String(i).repeat(1);
            const startTime = performance.now();
            const _ = await req2(test_string, port);
            const endTime = performance.now();
            return endTime - startTime;
        })();
    }
    console.log("calc: elapsed time [ms]: ", sum);
    const iter2 = 50;
    let sum2 = 0;
    for (let i = 0; i < iter2; i++) {
        sum2 += await (async () => {
            const test_string = String(i).repeat(100000);
            const startTime = performance.now();
            const _ = await req2(test_string, port);
            const endTime = performance.now();
            return endTime - startTime;
        })();
    }
    console.log("calc2: elapsed time [ms]: ", sum2);
}

async function main() {
    const argv = process.argv;
    if (argv.length < 3) {
        console.error("specify the server language: Go, Rust, Java, Python");
        process.exit(1);
    }
    let port: number = 0;
    switch (argv[2]) {
        case "Go":
        case "go":
            port = 50051;
            break;
        case "Rust":
        case "rust":
            port = 50052;
            break;
        case "Python":
        case "python":
            port = 50053;
            break;
        default:
            console.error("specify the server language: Go, Rust, Java, Python");
            process.exit(1);
    }
    hello(port)
    calc(port)
}

main();