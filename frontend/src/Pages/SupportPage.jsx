import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSupport, resetSupport } from "@/features/SupportSlice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Loader from "@/components/Loader/Loader";
import ServerErrorPage from "./Error/ServerErrorPage";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

function SupportPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const supportStatus = useSelector((state) => state.support.supportStatus);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (supportStatus === "succeeded") {
      toast.success("Thank you for contacting us");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    }
  }, [supportStatus]);

  const contactHandler = () => {
    if (name === "" && email === "" && subject === "" && message === "") {
      toast.warning("Please fill all the fields");
    } else {
      const supportPromise = dispatch(
        fetchSupport({ name, email, subject, message })
      ).unwrap();
      toast.promise(supportPromise, {
        loading: "Sending message...",
        success: "Message sent successfully",
        error: "Failed to send message",
      });
    }
  };

  const resetHandler = () => {
    dispatch(resetSupport());
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
    navigate(-1);
  };

  return (
    <div className="min-h-[80vh] w-[95%] md:w-[80%] mx-auto my-10 bg-background/50">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-2xl text-center">
            Support
          </CardTitle>
          {supportStatus === "idle" && (
            <CardDescription>
              Please take a moment to get in touch, we will get back to you
              shortly.
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {supportStatus === "idle" ? (
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="name"
                  required
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                  className="w-full"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  type="text"
                  required
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subject"
                  className="w-full"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="problem">What can we help you with?</Label>
                <Textarea
                  id="problem"
                  required
                  placeholder="Explain your problem"
                  onChange={(e) => setMessage(e.target.value)}
                  className="resize-none"
                  rows={14}
                />
              </div>
            </div>
          ) : supportStatus === "loading" ? (
            <Loader />
          ) : supportStatus === "failed" ? (
            <ServerErrorPage />
          ) : supportStatus === "succeeded" ? (
            <h1 className="text-base md:text-xl text-center font-semibold">
              Thank you for contacting us <br /> We will get back to you shortly
            </h1>
          ) : null}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          {supportStatus === "idle" && (
            <Button onClick={contactHandler} className="w-full">
              Submit
            </Button>
          )}
          {(supportStatus === "succeeded" ||
            supportStatus === "failed" ||
            supportStatus === "idle") && (
            <Button onClick={resetHandler} className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

export default SupportPage;
