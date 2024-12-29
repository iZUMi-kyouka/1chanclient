'use client';

import Grid from "@mui/material/Grid2";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Typography from "@mui/material/Typography";

export default function Notes() {
  const date = new Date();
  const dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

  return (
    <div>
      <Grid
        container
        spacing={2}
        padding={1}
      >
        {[1, 2, 3, 4, 5, 6].map(i => (
          <Grid
            key={i}
            size={{xs: 12, md: 6, lg: 4}}
          >
            <Card>
              <CardHeader
                action={
                  <IconButton>
                    <MoreVertIcon />
                  </IconButton>
                }
                title={`Thread #${i}`}
                subheader={dateStr}
              />
              <CardContent>
                <Typography>
                  Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  )
}