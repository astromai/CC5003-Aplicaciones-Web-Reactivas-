import { test, expect } from "@playwright/test";
import { loginWith, registerWith } from "./helper";


test.describe("URamos: create Malla", () => {

    test.beforeEach(async ({ page, request }) => {
        await request.post("http://localhost:3001/api/testing/reset");
        await request.post("http://localhost:3001/api/user/register", {
          data: {
            username: "test_user",
            password: "test_password"
          }
        });
        await page.goto("/");
        await loginWith(page, "test_user", "test_password");
    });

    test("users can´t create a new Malla without a name", async ({ page }) => {
        await page.getByRole("button", { name: "Nueva Malla" }).click();
        await page.getByRole("textbox", { exact: true }).nth(0).fill("");
        await page.getByPlaceholder("Ej: 10").fill("2");
        await page.getByRole("button", { name: "Crear Malla" }).click();
        await expect(page.getByText("El nombre de la malla es requerido")).toBeVisible();
    });

    test("users can create a new Malla", async ({ page }) => {
        await page.getByRole("button", { name: "Nueva Malla" }).click();
        await page.getByRole("textbox", { exact: true }).nth(0).fill("malla DCC 2040");
        await page.getByPlaceholder("Ej: 10").fill("2");
        await page.getByRole("button", { name: "Crear Malla" }).click();
        await expect(page.getByText("malla DCC 2040")).toBeVisible();
    });

    test("users can create a new Malla plan with the suggested base plan", async ({ page }) => {
        await page.getByRole("button", { name: "Nueva Malla" }).click();
        await page.getByRole("textbox", { exact: true }).nth(0).fill("malla DCC 2040");
        await page.getByRole("checkbox", { name: "Iniciar con malla ideal (plan base sugerido)" }).check();
        await page.getByRole("button", { name: "Crear Malla" }).click();
        await expect(page.getByText("malla DCC 2040")).toBeVisible();
    });
    
    test("users can delete a Malla", async ({ page }) => {
        await page.getByRole("button", { name: "Nueva Malla" }).click();
        await page.getByRole("textbox", { exact: true }).nth(0).fill("malla DCC 2040");
        await page.getByRole("checkbox", { name: "Iniciar con malla ideal (plan base sugerido)" }).check();
        await page.getByRole("button", { name: "Crear Malla" }).click();
        await page.getByRole("button", { name: "←" }).click();
        await page.getByText("malla DCC 2040").hover();
        page.once("dialog", dialog => dialog.accept());
        await page.getByRole("button", { name: "Eliminar" }).click();
        await expect(page.getByText("malla DCC 2040")).not.toBeVisible();
    });

});

test.describe("URamos: add courses to Malla", () => {

    test.beforeEach(async ({ page, request }) => {
        await request.post("http://localhost:3001/api/testing/reset");
        await request.post("http://localhost:3001/api/user/register", {
          data: {
            username: "test_user",
            password: "test_password"
          }
        });
        await page.goto("/");

        await loginWith(page, "test_user", "test_password");
        await page.getByRole("button", { name: "Nueva Malla" }).click();
        await page.getByRole("textbox", { exact: true }).nth(0).fill("malla DCC test");
        await page.getByPlaceholder("Ej: 10").fill("2");
        await page.getByRole("button", { name: "Crear Malla" }).click();
    });

    test("users can add a Ramo in Malla", async ({ page }) => {
        // Plan Común
        await page.getByRole("button", { name: "Agregar Ramo" }).first().click();
        await page.getByRole("button", { name: "Plan Común" }).click();
        await page.getByRole("button", { name: "CC" }).click(); 
        await page.getByRole('combobox', { name: '' }).selectOption("Aprobado");
        await page.getByRole("button", { name: "Herramientas Computacionales" }).click(); 

        // Especialidad - Electivo
        await page.getByRole("button", { name: "Agregar Ramo" }).first().click();
        await page.getByRole("button", { name: "Especialidad" }).click();
        await page.getByRole("button", { name: "Electivo" }).click(); 
        await page.getByRole("button", { name: "Ciberseguridad" }).click(); 
        await page.getByRole('combobox', { name: '' }).selectOption("Reprobado");
        await page.getByRole("button", { name: "Introducción a la Criptografía Moderna" }).click(); 

        // Especialidad - Núcleo Gestión
        await page.getByRole("button", { name: "Agregar Ramo" }).first().click();
        await page.getByRole("button", { name: "Especialidad" }).click();
        await page.getByRole("button", { name: "Núcleo Gestión" }).click();
        await page.getByRole("button", { name: "Todos" }).click(); 
        await page.getByRole('combobox', { name: '' }).selectOption("Aprobado");
        await page.getByRole("button", { name: "Gestión Informática" }).click(); 


        await expect(page.getByText("Herramientas Computacionales")).toBeVisible();
        await expect(page.getByText("Introducción a la Criptografía Moderna")).toBeVisible();
        await expect(page.getByText("Gestión Informática")).toBeVisible();
    });

    test("user can delete a Ramo in Malla", async ({ page }) => {
        await page.getByRole("button", { name: "Agregar Ramo" }).first().click();
        await page.getByRole("button", { name: "Plan Común" }).click();
        await page.getByRole("button", { name: "CC" }).click(); 
        await page.getByRole('combobox', { name: '' }).selectOption("Aprobado");
        await page.getByRole("button", { name: "Herramientas Computacionales" }).click(); 
        
        page.once('dialog', dialog => dialog.accept());
        const ramoContainer = page.locator('div.relative.group', { hasText: 'Herramientas Computacionales' });

        const eliminarBtn = ramoContainer.getByRole("button", { name: "×" });
        await eliminarBtn.click();

        await expect(page.getByText("Herramientas Computacionales")).toHaveCount(0);
        });

});


test.describe("URamos: see details of courses in Malla", () => {

    test.beforeEach(async ({ page, request }) => {
        await request.post("http://localhost:3001/api/testing/reset");
        await request.post("http://localhost:3001/api/user/register", {
          data: {
            username: "test_user",
            password: "test_password"
          }
        });
        await page.goto("/");

        await loginWith(page, "test_user", "test_password");
        await page.getByRole("button", { name: "Nueva Malla" }).click();
        await page.getByRole("textbox", { exact: true }).nth(0).fill("malla DCC test");
        await page.getByPlaceholder("Ej: 10").fill("2");
        await page.getByRole("button", { name: "Crear Malla" }).click();

        await page.getByRole("button", { name: "Agregar Ramo" }).first().click();
        await page.getByRole("button", { name: "Plan Común" }).click();
        await page.getByRole("button", { name: "CC" }).click(); 
        await page.getByRole('combobox', { name: '' }).selectOption("Aprobado");
        await page.getByRole("button", { name: "Herramientas Computacionales" }).click(); 
    });

    test("user can know information of a Ramo", async ({ page }) => {
        await page.getByText("Herramientas Computacionales").click();
        await expect(
          page.locator('p', { has: page.locator('strong', { hasText: 'Nombre:' }) })
        ).toContainText('Herramientas Computacionales');

        await expect(
          page.locator('p', { has: page.locator('strong', { hasText: 'Código:' }) })
        ).toContainText('CC1000');

        await expect(
          page.locator('p', { has: page.locator('strong', { hasText: 'Créditos:' }) })
        ).toContainText('3');

        await expect(
          page.locator('p', { has: page.locator('strong', { hasText: 'Porcentaje de Aprobación:' }) })
        ).toContainText('80%');

        await expect(
          page.locator('p', { has: page.locator('strong', { hasText: 'Descripción:' }) })
        ).toContainText('Introducción a herramientas computacionales para ingeniería');
    });
});