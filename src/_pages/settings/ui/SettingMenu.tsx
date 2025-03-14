'use client';

import { STYLES } from "@/global/styles";
import { useNextRouter } from "@/shared/hooks/useNextRouter";
import { Drawer, Box, Typography, List, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { Lock, UserCog } from "lucide-react";
import { settingMenu } from "../config/setting-menu";


const sidebarWidth = 350;

type SettingsMenuItemProps = {
  text: string,
  icon: React.ReactNode,
  subLink: string,
}
const SettingsMenuItem = ({
  text,
  icon,
  subLink: link,
}: SettingsMenuItemProps) => {
  const { router } = useNextRouter();

  return (
    <ListItem key={text} dense>
      <ListItemButton onClick={() => router.push(link)}>
        <ListItemIcon>
          {icon}
        </ListItemIcon>
        <ListItemText primary={text} />
      </ListItemButton>
    </ListItem>
  )
}

type SettingMenuProps = {
  className?: string
}
export const SettingMenu = ({
  className
}: SettingMenuProps) => {

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          width: sidebarWidth,
          zIndex: 1000,
        }}
        slotProps={{
          paper: {
            sx: {
              width: sidebarWidth,
              background: STYLES.color.background,
              boxSizing: 'border-box'
            }
          }
        }}
      >
        <Box sx={{
          overflow: 'auto',
          marginTop: 15,
        }}>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{
              paddingLeft: 2,
            }}
          >
            계정
          </Typography>
          <List>
            <SettingsMenuItem
              text={settingMenu.profile.text}
              icon={<UserCog />}
              subLink={settingMenu.profile.link}
            />
            <SettingsMenuItem
              text={settingMenu.account.text}
              icon={<Lock />}
              subLink={settingMenu.account.link}
            />
          </List>
          <Divider />
        </Box>
      </Drawer>
    </>
  )
}