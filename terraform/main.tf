terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }
  required_version = ">= 1.2.0"
}
provider "aws" {
  region = "us-east-1"
}
resource "aws_instance" "spotifyapp" {
  count = 1
  ami           = "ami-0e86e20dae9224db8"
  instance_type = "t2.micro"
  key_name      = "myKey"
  vpc_security_group_ids = [aws_security_group.spotifyapp_sg.id]

}
resource "aws_security_group" "spotifyapp_sg" {
    name        = "spotifyapp"
    description = "Allow inbound traffic"
    ingress {
        from_port   = 4000
        to_port     = 4000
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }
    ingress {
        from_port   = 22
        to_port     = 22
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }
    egress {
        from_port = 0
        to_port = 0
        protocol = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }
}