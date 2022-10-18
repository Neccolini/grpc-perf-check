from concurrent import futures
import grpc
import hashlib
import proto.pf_pb2 as pf_pb2
import proto.pf_pb2_grpc as pf_pb2_grpc

class Greeter(pf_pb2_grpc.GreeterServicer):
    def SayHello(self, request, _context):
        message = "Hello, %s!" % request.name
        return pf_pb2.HelloReply(message=message)
    def Calc(self, request, _context):
        m = hashlib.sha512()
        m.update(str(request.password).encode("utf-8"))
        result = int.from_bytes(m.hexdigest()[0].encode("utf-8"), byteorder="big")
        return pf_pb2.CalcReply(result=result)

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    pf_pb2_grpc.add_GreeterServicer_to_server(Greeter(), server)
    server.add_insecure_port('127.0.0.1:50053')
    print("server listening at {}".format('127.0.0.1:50053'))
    server.start()
    server.wait_for_termination()

if __name__ == '__main__':
    serve()
