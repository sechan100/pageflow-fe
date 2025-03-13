'use client'

import { Session, SessionUser, useLoginLogout, useSessionQuery } from "@/entities/user"
import { useNextRouter } from "@/shared/hooks/useNextRouter"
import { Logout } from "@mui/icons-material"
import { Avatar, Box, Button, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Popover, Typography } from "@mui/material"
import { Cog, LibraryBig, Pencil } from "lucide-react"
import { useCallback, useRef } from "react"
import { create } from "zustand"


type UseAccountPopoverStore = {
  popover: boolean
  setPopover: (popover: boolean) => void
}

const useAccountPopoverStore = create<UseAccountPopoverStore>((set) => ({
  popover: false,
  setPopover: (popover) => set({ popover })
}))

type UserInfoProps = {
  user: SessionUser
  className?: string
}
const UserInfo = ({
  user,
  className
}: UserInfoProps) => {

  return (
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
  )
}

type CustomListItemProps = {
  icon: React.ReactNode
  primary: string
  secondary?: string
  className?: string
  link?: string
}
const CustomListItem = ({
  icon,
  primary,
  secondary,
  link,
  className
}: CustomListItemProps) => {
  const { router } = useNextRouter();
  const { setPopover } = useAccountPopoverStore();

  const handleRoute = useCallback(() => {
    if (link) {
      router.push(link)
    }
    setPopover(false)
  }, [link, router, setPopover])

  return (
    <ListItem disablePadding>
      <ListItemButton onClick={handleRoute}>
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
const LogoutListItem = ({
  className
}: LogoutListItemProps) => {
  const { setPopover } = useAccountPopoverStore();
  const { router } = useNextRouter();
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
          onClick={() => {
            setPopover(false);
            console.log("로그아웃");
            router.push("/");
            logout();
          }}
          startIcon={<Logout />}
          variant="outlined"
        >
          로그아웃
        </Button>
      </Box>
    </ListItem>
  )
}

type Props = {
  className?: string
}
export const Account = ({
  className
}: Props) => {
  const session = useSessionQuery();
  const { popover, setPopover } = useAccountPopoverStore();
  const avatarContainerRef = useRef<HTMLButtonElement>(null);

  if (session.isLoading) {
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
          <UserInfo user={user} />
          <Divider />
          <CustomListItem
            icon={<Pencil />}
            primary="집필하기"
            link="/write"
          />
          <CustomListItem
            icon={<LibraryBig />}
            primary="서재"
          />
          <CustomListItem
            icon={<Cog />}
            primary="설정"
            link="/user/settings"
          />
          <Divider />
          <LogoutListItem />
        </List>
      </Popover>
    </Box>
  )
}