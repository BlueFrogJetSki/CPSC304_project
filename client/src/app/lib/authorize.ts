import { useRouter } from "next/navigation";
import { getCookie } from "./cookie";

//redirect to login if userId not in cookie
export default function authorize()
{
    const userId = getCookie("userId");
    const router = useRouter();
  
    //redirect to login page if user is not logged in
    if (userId == null) {
      router.push('/auth/login');
      return null;
    };

    return userId;
}