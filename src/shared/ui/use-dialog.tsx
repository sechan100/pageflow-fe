/**
 * @license mui/toolpad
 */

'use client';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import * as React from 'react';
import { create } from 'zustand';

// 로케일 텍스트 설정
const localeText = {
  alert: '알림',
  confirm: '확인',
  cancel: '취소',
  ok: '확인',
}

export interface OpenDialogOptions<R> {
  /**
   * 다이얼로그가 닫히기 전에 호출되는 함수입니다.
   * 반환된 프로미스가 해결될 때까지 다이얼로그는 열려 있습니다.
   * 비동기 작업을 수행하고 로딩 상태를 표시하려면 이 옵션을 사용하세요.
   *
   * @param result 다이얼로그가 닫힌 후 반환될 결과입니다.
   * @returns 다이얼로그가 닫힐 수 있을 때 해결되는 프로미스입니다.
   */
  onClose?: (result: R) => Promise<void>;
}

export interface AlertOptions extends OpenDialogOptions<void> {
  /**
   * 다이얼로그의 제목입니다. 기본값은 'Alert'입니다.
   */
  title?: React.ReactNode;
  /**
   * "Ok" 버튼에 표시될 텍스트입니다. 기본값은 'Ok'입니다.
   */
  okText?: React.ReactNode;
}

export interface ConfirmOptions extends OpenDialogOptions<boolean> {
  /**
   * 다이얼로그의 제목입니다. 기본값은 'Confirm'입니다.
   */
  title?: React.ReactNode;
  /**
   * "Ok" 버튼에 표시될 텍스트입니다. 기본값은 'Ok'입니다.
   */
  okText?: React.ReactNode;
  /**
   * 다이얼로그의 목적을 나타냅니다. 이는 "Ok" 버튼의 색상에 영향을 줍니다.
   * 기본값은 `undefined`입니다.
   */
  severity?: 'error' | 'info' | 'success' | 'warning';
  /**
   * "Cancel" 버튼에 표시될 텍스트입니다. 기본값은 'Cancel'입니다.
   */
  cancelText?: React.ReactNode;
}

export interface PromptOptions extends OpenDialogOptions<string | null> {
  /**
   * 다이얼로그의 제목입니다. 기본값은 'Prompt'입니다.
   */
  title?: React.ReactNode;
  /**
   * "Ok" 버튼에 표시될 텍스트입니다. 기본값은 'Ok'입니다.
   */
  okText?: React.ReactNode;
  /**
   * "Cancel" 버튼에 표시될 텍스트입니다. 기본값은 'Cancel'입니다.
   */
  cancelText?: React.ReactNode;
}

/**
 * 다이얼로그 컴포넌트에 전달되는 props입니다.
 */
export interface DialogProps<P = undefined, R = void> {
  /**
   * 다이얼로그가 열릴 때 전달된 페이로드입니다.
   */
  payload: P;
  /**
   * 다이얼로그의 열림 여부입니다.
   */
  open: boolean;
  /**
   * 다이얼로그가 닫힐 때 호출할 함수입니다.
   * 다이얼로그에 반환 값이 있는 경우 이 함수의 인자로 전달해야 합니다.
   * 다이얼로그가 닫힐 때 비동기 작업을 수행하는 동안 로딩 상태를 표시하려면
   * 반환된 프로미스를 사용해야 합니다.
   * @param result 다이얼로그에서 반환할 결과입니다.
   * @returns 다이얼로그가 완전히 닫힐 수 있을 때 해결되는 프로미스입니다.
   */
  onClose: (result: R) => Promise<void>;
}

export interface OpenAlertDialog {
  /**
   * 경고 다이얼로그를 엽니다. 사용자가 다이얼로그를 닫을 때 해결되는 프로미스를 반환합니다.
   *
   * @param msg 다이얼로그에 표시할 메시지입니다.
   * @param options 다이얼로그의 추가 옵션입니다.
   * @returns 다이얼로그가 닫힐 때 해결되는 프로미스입니다.
   */
  (msg: React.ReactNode, options?: AlertOptions): Promise<void>;
}

export interface OpenConfirmDialog {
  /**
   * 확인 다이얼로그를 엽니다. 사용자가 확인하면 true로, 취소하면 false로 해결되는 프로미스를 반환합니다.
   *
   * @param msg 다이얼로그에 표시할 메시지입니다.
   * @param options 다이얼로그의 추가 옵션입니다.
   * @returns 사용자가 확인하면 true로, 취소하면 false로 해결되는 프로미스입니다.
   */
  (msg: React.ReactNode, options?: ConfirmOptions): Promise<boolean>;
}

export interface OpenPromptDialog {
  /**
   * 사용자 입력을 요청하는 프롬프트 다이얼로그를 엽니다.
   * 사용자가 확인하면 입력으로, 취소하면 null로 해결되는 프로미스를 반환합니다.
   *
   * @param msg 다이얼로그에 표시할 메시지입니다.
   * @param options 다이얼로그의 추가 옵션입니다.
   * @returns 사용자가 확인하면 입력으로, 취소하면 null로 해결되는 프로미스입니다.
   */
  (msg: React.ReactNode, options?: PromptOptions): Promise<string | null>;
}

export type DialogComponent<P, R> = React.ComponentType<DialogProps<P, R>>;

export interface OpenDialog {
  /**
   * 페이로드 없이 다이얼로그를 엽니다.
   * @param Component 열 다이얼로그 컴포넌트입니다.
   * @param options 다이얼로그의 추가 옵션입니다.
   */
  <P extends undefined, R>(
    Component: DialogComponent<P, R>,
    payload?: P,
    options?: OpenDialogOptions<R>,
  ): Promise<R>;
  /**
   * 페이로드와 함께 다이얼로그를 엽니다.
   * @param Component 열 다이얼로그 컴포넌트입니다.
   * @param payload 다이얼로그에 전달할 페이로드입니다.
   * @param options 다이얼로그의 추가 옵션입니다.
   */
  <P, R>(Component: DialogComponent<P, R>, payload: P, options?: OpenDialogOptions<R>): Promise<R>;
}

export interface CloseDialog {
  /**
   * 다이얼로그를 닫고 결과를 반환합니다.
   * @param dialog 닫을 다이얼로그입니다. `open`이 반환한 프로미스입니다.
   * @param result 다이얼로그에서 반환할 결과입니다.
   * @returns 다이얼로그가 완전히 닫힐 때 해결되는 프로미스입니다.
   */
  <R>(dialog: Promise<R>, result: R): Promise<R>;
}

export interface DialogHook {
  alert: OpenAlertDialog;
  confirm: OpenConfirmDialog;
  prompt: OpenPromptDialog;
  open: OpenDialog;
  close: CloseDialog;
}

function useDialogLoadingButton(onClose: () => Promise<void>) {
  const [loading, setLoading] = React.useState(false);
  const handleClick = async () => {
    try {
      setLoading(true);
      await onClose();
    } finally {
      setLoading(false);
    }
  };
  return {
    onClick: handleClick,
    loading,
  };
}

export interface AlertDialogPayload extends AlertOptions {
  msg: React.ReactNode;
}

export function AlertDialog({ open, payload, onClose }: DialogProps<AlertDialogPayload, void>) {
  const okButtonProps = useDialogLoadingButton(() => onClose());
  return (
    <Dialog
      maxWidth="xs"
      fullWidth
      open={open}
      onClose={() => onClose()}
    >
      <DialogTitle>{payload.title ?? localeText.alert}</DialogTitle>
      <DialogContent>{payload.msg}</DialogContent>
      <DialogActions>
        <Button disabled={!open} {...okButtonProps}>
          {payload.okText ?? localeText.ok}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export interface ConfirmDialogPayload extends ConfirmOptions {
  msg: React.ReactNode;
}

export function ConfirmDialog({ open, payload, onClose }: DialogProps<ConfirmDialogPayload, boolean>) {
  const cancelButtonProps = useDialogLoadingButton(() => onClose(false));
  const okButtonProps = useDialogLoadingButton(() => onClose(true));
  return (
    <Dialog
      maxWidth="xs"
      fullWidth
      open={open}
      onClose={() => onClose(false)}
    >
      <DialogTitle>{payload.title ?? localeText.confirm}</DialogTitle>
      <DialogContent>{payload.msg}</DialogContent>
      <DialogActions>
        <Button autoFocus disabled={!open} {...cancelButtonProps}>
          {payload.cancelText ?? localeText.cancel}
        </Button>
        <Button color={payload.severity} disabled={!open} {...okButtonProps}>
          {payload.okText ?? localeText.ok}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export interface PromptDialogPayload extends PromptOptions {
  msg: React.ReactNode;
}

export function PromptDialog({ open, payload, onClose }: DialogProps<PromptDialogPayload, string | null>) {
  const [input, setInput] = React.useState('');
  const cancelButtonProps = useDialogLoadingButton(() => onClose(null));
  const [loading, setLoading] = React.useState(false);
  const name = 'input';

  return (
    <Dialog
      maxWidth="xs"
      fullWidth
      open={open}
      onClose={() => onClose(null)}
      PaperProps={{
        component: 'form',
        onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          try {
            setLoading(true);
            const formData = new FormData(event.currentTarget);
            const value = formData.get(name) ?? '';
            if (typeof value !== 'string') {
              throw new Error('Value must come from a text input');
            }
            await onClose(value);
          } finally {
            setLoading(false);
          }
        },
      }}
    >
      <DialogTitle>{payload.title ?? localeText.confirm}</DialogTitle>
      <DialogContent>
        <DialogContentText>{payload.msg}</DialogContentText>
        <TextField
          autoFocus
          required
          margin="dense"
          id="name"
          name={name}
          type="text"
          fullWidth
          variant="standard"
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button disabled={!open} {...cancelButtonProps}>
          {payload.cancelText ?? localeText.cancel}
        </Button>
        <Button disabled={!open || loading} type="submit">
          {payload.okText ?? localeText.ok}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Zustand 스토어 타입 정의
interface DialogStackEntry<P, R> {
  key: string;
  open: boolean;
  promise: Promise<R>;
  Component: DialogComponent<P, R>;
  payload: P;
  onClose: (result: R) => Promise<void>;
  resolve: (result: R) => void;
}

interface DialogState {
  stack: DialogStackEntry<any, any>[];
  nextId: number;
  keyPrefix: string;
  addDialog: <P, R>(
    Component: DialogComponent<P, R>,
    payload: P,
    options?: OpenDialogOptions<R>
  ) => Promise<R>;
  closeDialogUi: <R>(dialog: Promise<R>) => void;
  closeDialog: <R>(dialog: Promise<R>, result: R) => Promise<R>;
}

// Zustand 스토어 생성
const useDialogStore = create<DialogState>((set, get) => ({
  stack: [],
  nextId: 0,
  keyPrefix: 'dialog-',

  addDialog: async <P, R>(
    Component: DialogComponent<P, R>,
    payload: P,
    options: OpenDialogOptions<R> = {}
  ) => {
    const { onClose = async () => { } } = options;
    let resolveFunction: ((result: R) => void) | null = null;
    const promise = new Promise<R>((resolve) => {
      resolveFunction = resolve;
    });

    if (!resolveFunction) {
      throw new Error('resolve function not set');
    }

    const key = `${get().keyPrefix}-${get().nextId}`;

    const newEntry: DialogStackEntry<P, R> = {
      key,
      open: true,
      promise,
      Component,
      payload,
      onClose,
      resolve: resolveFunction,
    };

    set((state) => ({
      stack: [...state.stack, newEntry],
      nextId: state.nextId + 1,
    }));

    return promise;
  },

  closeDialogUi: <R,>(dialog: Promise<R>) => {
    set((state) => ({
      stack: state.stack.map((entry) =>
        entry.promise === dialog ? { ...entry, open: false } : entry
      ),
    }));

    setTimeout(() => {
      set((state) => ({
        stack: state.stack.filter((entry) => entry.promise !== dialog),
      }));
    }, 1000); // 애니메이션이 끝날 때까지 기다림
  },

  closeDialog: async <R,>(dialog: Promise<R>, result: R) => {
    const state = get();
    const entryToClose = state.stack.find((entry) => entry.promise === dialog);

    if (!entryToClose) {
      throw new Error('dialog not found');
    }

    await entryToClose.onClose(result);
    entryToClose.resolve(result);
    state.closeDialogUi(dialog);

    return dialog;
  },
}));

// 다이얼로그 훅
export function useDialog(): DialogHook {
  const { addDialog, closeDialog } = useDialogStore();

  const alert = React.useCallback<OpenAlertDialog>(
    (msg, { onClose, ...options } = {}) => addDialog(AlertDialog, { ...options, msg }, { onClose }),
    [addDialog],
  );

  const confirm = React.useCallback<OpenConfirmDialog>(
    (msg, { onClose, ...options } = {}) => addDialog(ConfirmDialog, { ...options, msg }, { onClose }),
    [addDialog],
  );

  const prompt = React.useCallback<OpenPromptDialog>(
    (msg, { onClose, ...options } = {}) => addDialog(PromptDialog, { ...options, msg }, { onClose }),
    [addDialog],
  );

  return React.useMemo(
    () => ({
      alert,
      confirm,
      prompt,
      open: addDialog,
      close: closeDialog,
    }),
    [alert, closeDialog, confirm, addDialog, prompt],
  );
}

interface DialogProviderProps {
  children?: React.ReactNode;
}

// 다이얼로그 프로바이더 (Context API 없이 Zustand로 구현)
export function DialogProvider({ children }: DialogProviderProps) {
  const stack = useDialogStore((state) => state.stack);

  return (
    <>
      {children}
      {stack.map(({ key, open, Component, payload, promise }) => (
        <Component
          key={key}
          payload={payload}
          open={open}
          onClose={async (result) => {
            await useDialogStore.getState().closeDialog(promise, result);
          }}
        />
      ))}
    </>
  );
}