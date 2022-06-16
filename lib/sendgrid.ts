import * as sgMail from "@sendgrid/mail";
const { SENDGRID_API_KEY } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY as string);

export async function sendCodeByEmail(to: string, code: number): Promise<void> {
   const email = {
      to,
      from: "miguelalexmunoz79@gmail.com",
      subject: `Tu código para ingresar a es ${code}`,
      text: `Código para ingresar ${to}`,
      html: `
      <div style="text-align: center">
         <h2>Código para ingresar</h2> 
         <h1>${code}</h1>
      </div>`,
   };

   try {
      await sgMail.send(email);
      console.log("Email sent");
   } catch (err) {
      console.log(err);
   }
}

export async function sendDataPayment(to: string, userName: string): Promise<void> {
   const email = {
      to,
      from: "miguelalexmunoz79@gmail.com",
      subject: `Tu compra ha sido exitosa`,
      text: `Compra exitosa`,
      html: `
         <div style="text-align: center">
            <h1>Hola ${userName} espero que disfrutes tu compra</h1>
         </div>`,
   };

   try {
      await sgMail.send(email);
      console.log("Email sent");
   } catch (err) {
      console.log(err);
   }
}
