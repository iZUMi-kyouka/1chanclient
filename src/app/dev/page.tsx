import { ForwardRefEditor } from "@/components/forwardRefEditor";
import Typography from "@mui/material/Typography";

export default function Page() {
  return (
    <>
      <Typography>This is development route root.</Typography>
      <ForwardRefEditor markdown={"Hello, **world**!"} />
    </>
  );
}