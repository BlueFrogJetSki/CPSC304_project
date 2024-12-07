interface Props {
    message:string;
}
export default function ErrorMessage({message}:Props){
    return(
        <h2>{message}</h2>
    )
}