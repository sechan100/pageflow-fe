'use client'
import { useEditorBookStore } from "@/entities/book";
import { useNotification } from "@/shared/ui/notification";
import { Box, Button, Grid2, SxProps } from "@mui/material";
import { CloudUploadIcon } from "lucide-react";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import Cropper, { Area } from 'react-easy-crop';
import { create } from "zustand";
import { useChangeBookCoverImageMutation } from "../api/change-book-cover-image";
import { createCroppedImageFile } from "../model/crop-image";

const bookCoverImageHeight = 350;
const bookCoverImageWidth = bookCoverImageHeight * 2 / 3;

type CoverImageStore = {
  cropMode: boolean;
  setCropMode: (mode: boolean) => void;
  coverImageSrc: string | null;
  coverImageFile: File | null;
  setCoverImage: (file: File) => void;
  clearCoverImage: () => void;
}
const useCoverImageStore = create<CoverImageStore>()((set) => ({
  cropMode: false,
  setCropMode: (mode: boolean) => set({ cropMode: mode }),
  coverImageSrc: null,
  coverImageFile: null,
  setCoverImage: (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      set({ coverImageSrc: reader.result as string, coverImageFile: file });
    };
    reader.readAsDataURL(file);
  },
  clearCoverImage: () => set({ coverImageSrc: null, coverImageFile: null }),
}));

type GridTemplateProps = {
  image: React.ReactNode;
  button: React.ReactNode;
  sx?: SxProps;
}
const GridTemplate = ({
  image,
  button,
  sx
}: GridTemplateProps) => {

  return (
    <Grid2
      container
      gap={1}
      height={bookCoverImageHeight}
      justifyContent="space-evenly"
    >
      <Grid2
        size={8}
        sx={{ position: 'relative' }}>
        {image}
      </Grid2>
      <Grid2
        size={3}
        alignContent="center"
      >
        {button}
      </Grid2>
    </Grid2>
  )
}

const CropMode = () => {
  const notification = useNotification();
  const { id: bookId } = useEditorBookStore(s => s.book);
  const { mutateAsync: changeBookCoverImageAsync } = useChangeBookCoverImageMutation(bookId);
  const { coverImageFile, coverImageSrc, setCropMode, clearCoverImage } = useCoverImageStore();

  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const croppedAreaRef = useRef<Area | null>(null);

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    croppedAreaRef.current = croppedAreaPixels;
  }, []);

  // crop한 이미지 저장
  const saveCroppedImage = useCallback(async () => {
    if (!croppedAreaRef.current || !coverImageSrc || !coverImageFile) {
      return;
    }
    const croppedImageFile = await createCroppedImageFile({
      src: coverImageSrc,
      file: coverImageFile,
      cropArea: croppedAreaRef.current,
    })

    const res = await changeBookCoverImageAsync(croppedImageFile);
    if (res.success) {
      notification.success("표지 사진이 변경되었습니다.");
      clearCoverImage();
      setCropMode(false);
    } else {
      notification.error("표지 사진 변경에 실패했습니다.");
    }
  }, [changeBookCoverImageAsync, clearCoverImage, coverImageFile, coverImageSrc, notification, setCropMode])


  if (!coverImageSrc || !coverImageFile) {
    return <div>이미지 파일이 선택되지 않았습니다.</div>
  }
  return (
    <GridTemplate
      image={
        <Cropper
          image={coverImageSrc}
          crop={crop}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          cropSize={{
            width: bookCoverImageWidth,
            height: bookCoverImageHeight
          }}
          aspect={1 / 1.5}
          zoom={zoom}
          onZoomChange={setZoom}
        />
      }
      button={
        <Button
          fullWidth
          variant="contained"
          onClick={saveCroppedImage}
        >
          저장
        </Button>
      }
    />
  )
}


type Props = {
  sx?: SxProps;
}
export const BookCoverImageEditor = ({
  sx
}: Props) => {
  const book = useEditorBookStore(s => s.book);
  const { setCoverImage, cropMode, setCropMode } = useCoverImageStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageButtonClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setCoverImage(file);
      setCropMode(true);
    }
  }, [setCoverImage, setCropMode]);


  if (cropMode) {
    return <CropMode />
  } else {
    return (
      <GridTemplate
        image={
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Image
              src={book.coverImageUrl}
              alt="book cover image"
              width={bookCoverImageWidth}
              height={bookCoverImageHeight}
              priority
            />
          </Box>
        }
        button={
          <Box
            sx={{
              height: "100%",
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-evenly',
              alignItems: 'center',
            }}>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
            <Button
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              onClick={handleImageButtonClick}
              fullWidth
            >
              사진 선택
            </Button>
          </Box>
        }
      />
    )
  }
}