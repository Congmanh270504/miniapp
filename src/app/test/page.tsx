"use client";
import { Button } from "@/components/ui/button";
import { createManyGenres } from "@/lib/actions/genre";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { RootState, AppDispatch } from "@/store/store";
import { fetchGenres } from "@/store/genres/genres";

const Page = () => {

  return (
    <div>
      <Button onClick={createManyGenres}>aa</Button>
    </div>
  );
};

export default Page;
