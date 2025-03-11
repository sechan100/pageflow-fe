'use client';

import { zodUserSchemata } from "@/bounded-context/user/shared/UserSchemata";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/shadcn/form";
import { Input } from "@/shared/components/shadcn/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/components/shadcn/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouting } from "@/shared/hook/useRouting";
import { signupApi, SignupForm }  from "@/bounded-context/user/api/signup";
import { ApiResponse } from "@/global/api/ApiResponse";
import { FieldError, FieldErrors } from "@/global/api/commonResponseTypes";




export default function OAuth2SignupForm(){
  const { getUrlState } = useRouting();

  // 라우팅으로 같이 넘어온 데이터가 존재하지 않음 -> 라우팅을 통한 접근이 아니므로 에러
  if(!getUrlState().signupCache){
    throw new Error("url state가 존재하지 않습니다.");
  }
  const signupCache = getUrlState().signupCache;

  // Zod 스키마 정의
  const signupFormSchema = z.object({
    // email
    email: z.string().email(),
    // penname
    penname: zodUserSchemata.penname,
  })

  // form 객체 생성
  const signupForm = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      email: signupCache.email,
      penname: signupCache.penname,
    },
  })

  // 제출 이벤트 콜백
  async function onSubmit(values: z.infer<typeof signupFormSchema>){
    // Post 요청에 담을 객체를 생성
    const requestForm: SignupForm = {
      username: signupCache.username,
      password: signupCache.password ?? "oauth2DummyPassword111",
      email: values.email,
      penname: values.penname,
      profileImgUrl: signupCache.profileImgUrl,
    }
    // 회원가입 요청 전송
    const res = await signupApi.signup(requestForm);
    res.dispatch(b => b
      .when(4100, (res) => {
        res.data.errors.forEach(
          (error: FieldError) => signupForm.setError(
            // @ts-ignore
            error.field, { type: "manual", message: error.message}
          )
        )
      })
    )
  }

  return (
    <Form {...signupForm}>
      <form id="signup_form" onSubmit={signupForm.handleSubmit(onSubmit)} className="space-y-2">
        {/* email 필드 */}
        <FormField
          control={signupForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">이메일</FormLabel>
              <FormControl>
                <Input type="email" placeholder="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* penname 필드 */}
        <FormField
          control={signupForm.control}
          name="penname"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">필명</FormLabel>
              <FormControl>
                <Input type="penname" placeholder="penname" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
      <Button form="signup_form" type="submit" className="rounded-full">회원가입</Button>
    </Form>
  )
}