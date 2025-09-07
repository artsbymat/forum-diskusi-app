/**
  Skenario Pengujian Login:
  - Menampilkan halaman login dengan benar
  - Menampilkan notifikasi jika email kosong
  - Menampilkan notifikasi jika password kosong
  - Menampilkan notifikasi jika email dan password salah
  - Menampilkan halaman utama jika email dan password benar
  - Menampilkan link "Buat Thread" setelah login berhasil
*/

describe('Skenario Login', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/login');
  });

  it('menampilkan halaman login dengan benar', () => {
    cy.get('input[placeholder="nama@email.com"]').should('be.visible');
    cy.get('input[placeholder="Masukkan password"]').should('be.visible');
    cy.get('button')
      .contains(/^Masuk$/)
      .should('be.visible');
  });

  it('menampilkan notifikasi jika email kosong', () => {
    cy.get('button')
      .contains(/^Masuk$/)
      .click();
    cy.get('.toaster [role="status"], [data-sonner-toast], .sonner-toast').should(
      'contain',
      'email'
    );
  });

  it('menampilkan notifikasi jika password kosong', () => {
    cy.get('input[placeholder="nama@email.com"]').type('akuntestingrahmat@gmail.com');
    cy.get('button')
      .contains(/^Masuk$/)
      .click();
    cy.get('.toaster [role="status"], [data-sonner-toast], .sonner-toast').should(
      'contain',
      'password'
    );
  });

  it('menampilkan notifikasi jika email dan password salah', () => {
    cy.get('input[placeholder="nama@email.com"]').type('testuser@gmail.com');
    cy.get('input[placeholder="Masukkan password"]').type('wrong_password');
    cy.get('button')
      .contains(/^Masuk$/)
      .click();
    cy.get('.toaster [role="status"], [data-sonner-toast], .sonner-toast').should(
      'contain',
      'email or password is wrong'
    );
  });

  it('menampilkan halaman utama jika email dan password benar', () => {
    cy.get('input[placeholder="nama@email.com"]').type('akuntestingrahmat@gmail.com');
    cy.get('input[placeholder="Masukkan password"]').type('123123');
    cy.get('button')
      .contains(/^Masuk$/)
      .click();
    cy.url().should('include', '/');
    cy.contains('button', /keluar|sign out/i, { timeout: 20000 }).should('be.visible');
  });

  it('menampilkan link "Buat Thread" setelah login berhasil', () => {
    cy.get('input[placeholder="nama@email.com"]').type('akuntestingrahmat@gmail.com');
    cy.get('input[placeholder="Masukkan password"]').type('123123');
    cy.get('button')
      .contains(/^Masuk$/)
      .click();

    cy.url().should('include', '/');
    cy.contains('a', /buat thread/i, { timeout: 10000 }).should('be.visible');
  });
});
