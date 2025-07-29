import { ImgHTMLAttributes } from "react";
import { Link } from "@inertiajs/react";

export default function ApplicationLogo(
    props: ImgHTMLAttributes<HTMLImageElement>
) {
    return (
        <Link href="/">
            <img
                {...props}
                src="/image/logo/logo.png"
                alt="Application Logo"
                className={`h-20 w-auto ${props.className || ""}`} // Ukuran default
            />
        </Link>
    );
}
