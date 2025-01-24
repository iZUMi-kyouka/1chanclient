import { RefreshSharp } from "@mui/icons-material"
import { IconButton } from "@mui/material"

const RefreshButton = ({ onClick }: { onClick?: (e?: React.MouseEvent<HTMLElement>) => void}) => {
  return (
    <IconButton
      onClick={onClick}
    >
      <RefreshSharp />
    </IconButton>
  )
}

export default RefreshButton