import * as sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export async function sendEmail(to: string, code: number): Promise<void> {
   return await sgMail
      .send({
         to,
         from: "miguelalexmunoz79@gmail.com",
         subject: `Tu código para ingresar a es ${code}`,
         text: `Código para ingresar ${to}`,
         html: `
         <div style="text-align: center">
            <h2>Código para ingresar</h2> 
            <h1>${code}</h1>
         </div>`,
      })
      .then(() => {
         console.log("Email sent");
      })
      .catch((error) => {
         console.error("Error sending email", error);
      });
}
