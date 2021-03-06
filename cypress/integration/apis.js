// / <reference types="Cypress" />

import { login } from '../support/login';

import apiData from '../data/apiData.json';

describe('Apis', () => {
    it('should find an api in the datagrid and in the list of cards', () => {
        cy.loadData(apiData);

        login('portalAdmin', 'Password@1');

        cy.findAllByText('APIs')
            .first()
            .click();

        // As a datagrid

        cy.findByTitle('Display as list').click();

        cy.findByText('Created').click({ force: true }); // Sort by created date

        cy.findByTitle('GB National Configuration');

        // As a list of cards

        cy.findByTitle('Display as cards').click();

        cy.findByTitle('GB National Configuration');
    });

    it('should show an api details', () => {
        cy.loadData(apiData);

        login('portalAdmin', 'Password@1');

        cy.findAllByText('APIs')
            .first()
            .click();

        cy.findByTitle('Display as list').click();

        cy.findByText('Created').click({ force: true }); // Sort by created date

        cy.findByTitle('GB National Configuration').click();

        // Overview Tab
        cy.findByLabelText('State').should('contain', 'Unpublished');
        // cy.findByLabelText('Type').should('contain', 'REST');
        cy.findByLabelText('Version').should('contain', 'v5.2.1');
        cy.findByLabelText('Visibility').should('contain', 'Public');
        cy.findByLabelText('Modified').should('contain', '4/28/2020');
        // cy.findByLabelText('Applications').should('contain', '3');
        cy.findByLabelText('Description').should(
            'contain',
            'Monitored analyzing neural-net'
        );
        cy.findByLabelText('Tags').should('contain', 'Accounts');
        cy.findByLabelText('Tags').should('contain', 'Organizations');
        cy.findByLabelText('Tags').should('contain', 'Plans');

        cy.findByLabelText('Assets').should('contain', 'paradigm.json');
        cy.findByLabelText('Assets').should(
            'contain',
            'hard_drive_auto_loan_account_fish.json'
        );
        cy.findByLabelText('Download Assets');

        // Specs Tab
        cy.findByText('Specs').click();
        cy.contains('[ Base URL: /login ]');

        // Documentation Tab
        cy.findByText('Documentation').click();
        cy.findByLabelText('en-US - Integrated high-level encoding').click();
        // Documentation content
        cy.contains(
            'Quam temporibus maxime voluptatem aliquam sunt nostrum accusamus.'
        );
        // Documentation children
        cy.findAllByLabelText('en-US - Realigned encompassing forecast');
    });

    it('should open the first document by default', () => {
        login('portalAdmin', 'Password@1');

        cy.findAllByText('APIs')
            .first()
            .click();

        cy.findByTitle('Display as list').click();
        cy.findByText('Created').click({ force: true }); // Sort by created date

        cy.findByTitle('GB National Configuration').click();

        cy.findByText('Documentation').click();
        cy.findByText('en-US - Integrated high-level encoding');
        cy.contains(
            'Quam temporibus maxime voluptatem aliquam sunt nostrum accusamus.'
        );
    });

    it('should allow to create, edit and delete documents', () => {
        cy.loadData(apiData);

        login('portalAdmin', 'Password@1');

        cy.findAllByText('APIs')
            .first()
            .click();

        cy.findByTitle('Display as list').click();
        cy.findByText('Created').click({ force: true }); // Sort by created date

        cy.findByTitle('GB National Configuration').click();

        cy.findByText('Documentation').click();
        cy.findByLabelText('New root document').click();
        // A new root node should have been added in the tree
        cy.findByLabelText('New document');
        // A form input with a default title should be displayed
        cy.findByDisplayValue('New document')
            .clear()
            .type('A new root');
        // A form input with a default navtitle generated from title should be diplayed
        cy.findByDisplayValue('A-new-root')
            .clear()
            .type('a-new-root');
        cy.findAllByLabelText('Content *').type('Some markdown');
        cy.findAllByText('Some markdown').should('have.length', 2);
        cy.findByLabelText('Publish').click();
        cy.findAllByLabelText('New document').should('have.length', 0);
        cy.findByLabelText('A new root');
        cy.findAllByText('Some markdown').should('have.length', 1);

        cy.findAllByLabelText('New child').click();
        // A new root node should have been added in the tree
        // And it should be visible immediatly as its parent should be
        // automatically expanded when adding a child
        cy.findByLabelText('New document');
        // A form input with a default title should be displayed
        cy.findByDisplayValue('New document')
            .clear()
            .type('A new child');
        // A form input with a default navtitle generated from title should be diplayed
        cy.findByDisplayValue('A-new-child')
            .clear()
            .type('a-new-child');
        cy.findAllByLabelText('Content *').type('Some markdown for child');
        cy.findAllByText('Some markdown for child').should('have.length', 2);
        cy.findByLabelText('Publish').click();
        cy.findAllByLabelText('New document').should('have.length', 0);
        cy.findByLabelText('A new child');
        cy.findAllByText('Some markdown for child').should('have.length', 1);

        cy.findByLabelText('Edit').click();
        cy.findByDisplayValue('A new child')
            .clear()
            .type('A better child');
        cy.findByDisplayValue('Some markdown for child')
            .clear()
            .type('Some better markdown for child');
        cy.findByLabelText('Publish').click();
        cy.findByLabelText('A better child');
        cy.findByText('Some better markdown for child');
        cy.findByLabelText('Delete').click();
        cy.findAllByText('Document successfully deleted.');

        cy.get('#react-admin-title').click(); // Cancel the notification by clicking on the page title

        cy.findByLabelText('A new root');
        cy.findAllByLabelText('A better child').should('have.length', 0);
    });

    it('should allow to edit other languages for documentation', () => {
        cy.loadData(apiData);

        login('portalAdmin', 'Password@1');

        cy.findAllByText('APIs')
            .first()
            .click();

        cy.findByTitle('Display as list').click();

        cy.findByText('Created').click({ force: true }); // Sort by created date

        cy.findByTitle('GB National Configuration').click();

        cy.findByText('Documentation').click();

        // Has english documentation by default
        cy.findByText('en-US - Integrated high-level encoding');

        cy.findByLabelText('Selected language').click();
        cy.findByText('Français').click();

        // Has french documentation loaded
        cy.findByText('fr-FR - Intuitive actuating moderator').click();
        cy.findByLabelText('Edit').click();
        cy.findByDisplayValue('fr-FR - Intuitive actuating moderator')
            .clear()
            .type('fr-FR Une baguette!');
        cy.findByLabelText('Publish').click();
        cy.findByText('fr-FR Une baguette!');

        cy.findByLabelText('Selected language').click();
        cy.findByText('English', { selector: '[role=menuitem]' }).click();
        cy.findAllByText('fr-FR Une baguette!').should('have.length', 0);
        cy.findByText('en-US - Integrated high-level encoding');
    });

    it('should not allow a user without edition rights to edit the documentation', () => {
        cy.loadData(apiData);

        login('user', 'Password@1');

        cy.findAllByText('APIs')
            .first()
            .click();

        cy.findByTitle('Display as list').click();

        cy.findByText('Created').click({ force: true }); // Sort by created date

        cy.findByTitle('GB National Configuration').click();

        cy.findByText('Documentation').click();

        cy.findByText('en-US - Integrated high-level encoding').click();
        cy.contains(
            'Quam temporibus maxime voluptatem aliquam sunt nostrum accusamus.'
        );
        cy.findAllByLabelText('Edit').should('have.length', 0);
    });
});
