import { Page } from "playwright/test"

const loginWith = async ( page: Page, username: string, password: string ) => {
    await page.getByPlaceholder("Usuario").fill(username);
    await page.getByPlaceholder("Contraseña").fill(password);
    await page.getByRole("button", {name: "Iniciar Sesión"}).click();
}

const registerWith = async ( page: Page, username: string, password: string ) => {
    await page.getByRole("textbox", { exact: true }).nth(0).fill(username);
    await page.getByRole("textbox", { exact: true }).nth(1).fill(password);
    await page.getByRole("textbox", { exact: true }).nth(2).fill(password);    
    await page.getByRole("button", { name: "Registrarse" }).click();
}

export { loginWith, registerWith }