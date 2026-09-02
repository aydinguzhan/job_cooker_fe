import { QRCodeCanvas } from "qrcode.react";

type Props = {
  url: string;
};

export default function LoginQr({ url }: Props) {
  console.log(url);
  return <QRCodeCanvas value={url} size={220} />;
}
