'use client';

import CloseIcon from '@mui/icons-material/Close';
import { Alert, Badge, Button, IconButton, Paper, Snackbar, SnackbarContent, SnackbarOrigin } from '@mui/material';
import * as React from 'react';
import { useNotificationsStore } from './notificationsStore';
import type { ShowNotificationOptions } from './types';


export interface NotificationsProviderProps {
  children?: React.ReactNode;
  anchorOrigin?: SnackbarOrigin;
}

const anchorOrigin: SnackbarOrigin = {
  vertical: 'top',
  horizontal: 'right'
};

function Notification({
  id,
  message,
  options,
  badge,
}: {
  id: string;
  message: React.ReactNode;
  options: ShowNotificationOptions;
  badge: string | null;
}) {
  const close = useNotificationsStore(state => state.close);
  const {
    severity,
    actionText,
    onAction,
    autoHideDuration
  } = options;

  const handleClose = React.useCallback((event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    close(id);
  }, [id, close]);

  const action = (
    <React.Fragment>
      {onAction ? (
        <Button
          color="inherit"
          size="small"
          onClick={onAction}
        >
          {actionText ?? 'Action'}
        </Button>
      ) : null}
      <IconButton
        size="small"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <Snackbar
      open={true}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      action={action}
      anchorOrigin={anchorOrigin}
    >
      <Paper elevation={3}>
        <Badge
          badgeContent={badge}
          color="primary"
          sx={{ width: '100%' }}
        >
          {severity ? (
            <Alert
              severity={severity}
              sx={{ width: '100%' }}
              action={action}
            >
              {message}
            </Alert>
          ) : (
            <SnackbarContent
              message={message}
              action={action}
            />
          )}
        </Badge>
      </Paper>
    </Snackbar>
  );
}

const Notifications = () => {
  const queue = useNotificationsStore(state => state.queue);
  const currentNotification = queue[0] ?? null;

  return currentNotification ? (
    <Notification
      id={currentNotification.id}
      message={currentNotification.message}
      options={currentNotification.options}
      badge={queue.length > 1 ? String(queue.length) : null}
    />
  ) : null;
}

export const NotificationProvider = ({
  children,
}: NotificationsProviderProps) => {
  return (
    <>
      {children}
      <Notifications />
    </>
  );
}