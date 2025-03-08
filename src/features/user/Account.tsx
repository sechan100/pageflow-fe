/** @jsxImportSource @emotion/react */
'use client'

import { Session, useLoginLogout, useSessionQuery } from "@/entities/user"
import { Book, LibraryBooks, Logout } from "@mui/icons-material"
import { Avatar, Box, Button, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Popover, Typography } from "@mui/material"
import { LibraryBig, Pencil } from "lucide-react"
import { useRef, useState } from "react"


type Props = {
  className?: string
}
export const AccountFeature = ({
  className
}: Props) => {
  const session = useSessionQuery();
  const [popover, setPopover] = useState(false);
  const avatarContainerRef = useRef<HTMLButtonElement>(null);
  
  if(session.isLoading) {
    return (
      <Avatar>P</Avatar>
    )
  }
  
  const user = (session.data as Session).user;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1
      }}
    >
      <Button
        ref={avatarContainerRef}
        onClick={() => setPopover(!popover)}
        disableRipple
      >
        <Avatar
          src={user.profileImageUrl}
        />
      </Button>

      {/* 팝오버 창 */}
      <Popover 
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        anchorEl={avatarContainerRef.current}
        open={popover}
        onClose={() => setPopover(false)}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 2
            }
          }
        }}
      >
        <List>
          <ListItem>
            <Box 
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "center"
              }}
            >
              <Avatar
                sx={{
                  width: "50px",
                  height: "50px"
                }}
                src={user.profileImageUrl}
              />
              <div>
                <Typography
                  color="primary"
                  sx={{
                    display: "inline",
                    fontWeight: "bold",
                  }}
                >
                  {user.penname}
                </Typography>
                <span>&nbsp;작가님</span>
                <Typography
                  color="textSecondary"
                  sx={{
                    fontSize: "0.9em"
                  }}
                >
                  {user.email}
                </Typography>
              </div>
            </Box>
          </ListItem>
          <Divider />
          <CustomListIte
            icon={<Pencil />}
            primary="집필하기"
          />
          <CustomListIte
            icon={<LibraryBig />}
            primary="서재"
          />
          <Divider />
          <LogoutListItem />
        </List>
      </Popover>
    </Box>
  )
}


type CustomListIteProps = {
  icon: React.ReactNode
  primary: string
  secondary?: string
  className?: string
}
export const CustomListIte = ({
  icon,
  primary,
  secondary,
  className
}: CustomListIteProps) => {
  
  return (
    <ListItem disablePadding>
      <ListItemButton>
        <ListItemIcon>
          {icon}
        </ListItemIcon>
        <ListItemText primary={primary} secondary={secondary} />
      </ListItemButton>
    </ListItem>
  )
}


type LogoutListItemProps = {
  className?: string
}
export const LogoutListItem = ({
  className
}: LogoutListItemProps) => {
  const { logout } = useLoginLogout();
  
  return (
    <ListItem disablePadding dense>
      <Box sx={{
        display: "flex",
        justifyContent: "end",
        width: "100%",
        marginTop: 1,
        marginRight: 1
      }}>
        <Button
          size="small"
          onClick={logout}
          startIcon={<Logout />}
          variant="outlined"
        >
          로그아웃
        </Button>
      </Box>
    </ListItem>
  )
}