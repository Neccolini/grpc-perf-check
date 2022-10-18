package main

import (
	"context"
	"crypto/sha512"
	"flag"
	"fmt"
	"log"
	"net"

	pb "pf/proto"

	"google.golang.org/grpc"
)
var (
	port = flag.Int("port", 50051, "The server port")
)
type server struct {
	pb.UnimplementedGreeterServer
}

func (s *server) SayHello(ctx context.Context, in *pb.HelloRequest) (*pb.HelloReply, error) {
	return &pb.HelloReply{Message: "Hello, I'm Go"}, nil
}

func (s *server) Calc(ctx context.Context, in *pb.CalcRequest) (*pb.CalcReply, error) {
	sha512 := sha512.Sum512([]byte(in.Password))
	return &pb.CalcReply{Result: int32(sha512[0])}, nil
}
func main() {
	flag.Parse()
	lis, err := net.Listen("tcp", fmt.Sprintf(":%d", *port))
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	s := grpc.NewServer()
	pb.RegisterGreeterServer(s, &server{})
	log.Printf("server listening at %v", lis.Addr())
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
