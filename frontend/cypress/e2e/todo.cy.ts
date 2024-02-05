describe('Todo App', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200'); // Update with your Angular app's URL
  });

  it('should show button to create a new todo', () => {
    cy.get('[data-cy="createTodoButton"]').should('be.visible');
  });

  it('should add a new todo', () => {
    cy.get('[data-cy="createTodoButton"]').click();

    cy.get('[data-cy="newTodoTitleInput"]').type('New Todo');
    cy.get('[data-cy="newTodoDescriptionInput"]').type('Description for the new todo');
    cy.get('[data-cy="addTodoButton"]').click();

    cy.get('[data-cy="todosList"]').should('contain', 'New Todo');
  });

  it('should edit a todo', () => {
    cy.get('[data-cy="editTodoButton"]').first().click();

    cy.get('[data-cy=editTitleInput]').clear().type('Updated Todo');
    cy.get('[data-cy=editDescriptionInput]').clear().type('Updated description');
    cy.get('[data-cy=saveTodoButton]').click();
    cy.get('[data-cy="todosList"]').should('contain', 'Updated Todo');
  });

  it('should cancel editing a todo', () => {
    cy.get('[data-cy="newTodoTitle"]').first().then(($title) => {
      const firstTodoTitle = $title.text();

      cy.get('[data-cy="editTodoButton"]').first().click();
      cy.get('[data-cy=cancelEditButton]').click();
      // Ensure the original content is still present after canceling edit
      cy.get('[data-cy="newTodoTitle"]').first().then(($val) => {
        expect(firstTodoTitle).eq($val.text());
      })
    });
  });

  it('should remove a todo', () => {
    cy.get('[data-cy="removeTodoButton"]').first().contains('Remove').click();
    // Ensure the removed todo is no longer present
    cy.get('[data-cy="todosList"]').should('not.contain', 'Your Original Todo');
  });

});
