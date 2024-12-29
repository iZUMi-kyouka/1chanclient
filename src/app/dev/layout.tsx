import { ReactNode } from "react";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

export default function Layout(
  { children }: { children: ReactNode}) {
  return (
    <>
      <Typography variant={"h5"}>Development</Typography>
      <Container>
        { children }
      </Container>
    </>
  )
}