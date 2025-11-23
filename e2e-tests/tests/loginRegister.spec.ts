import { test, expect } from "@playwright/test";
import { loginWith, registerWith } from "./helper";


test.describe("URamos: Login and Registration", () => {

    test.beforeEach(async ({ page, request }, testInfo) => {
    if (testInfo.title !== "users registered can login successfully") {
        await request.post("http://localhost:3001/api/testing/reset");
    }
    await page.goto("/");
    });

    test("users with inexistent credentials can't login", async ({ page }) => {
        await loginWith(page, "test1", "123");
        await expect(page.getByText("Error al hacer login. Revisa tus credenciales.")).toBeVisible();
    });

    test("new users can register sucessfully, login and logout", async ({ page }) => {
        await page.getByRole("button", { name: "Regístrate aquí" }).click();
        await registerWith(page, "test_user", "test_password");
        await expect(page.getByText("Mis Mallas")).toBeVisible();
        await page.getByRole("button", { name: "Cerrar Sesión" }).click();
        await expect(page.getByRole("button", { name: "Iniciar Sesión" })).toBeVisible();
    });

    test("users registered can login successfully", async ({ page }) => {
        await loginWith(page, "test_user", "test_password");
        await expect(page.getByText("Mis Mallas")).toBeVisible();
    });

});
