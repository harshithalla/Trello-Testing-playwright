import {test,expect} from '@playwright/test';
import {testData} from '../utilis/TestData';

test(`Open ${testData.cardName}`, async({page})=>{
    //this code for opening the trello home page and login page
    await page.goto('https://trello.com/');
    await expect(page).toHaveURL('https://trello.com/');
    console.log("Trello Home Page Opened");
    const loginbutton =page.locator("//a[@class='sc-lcItFd lhPfTY']");
    await loginbutton.click();
    await expect(page).toHaveURL(/id\.atlassian\.com\/login/);
    console.log("Trello login page opened");

    //this code is for login into trello account
    const emailinput=page.locator("#username-_r0_");
    const paswordinput=page.locator("#password");
    const continuebutton=page.locator("#login-submit");
    const loginbutton1=page.locator("#login-submit");
    await expect(emailinput).toBeVisible();
    await emailinput.fill("leoallla32@gmail.com");
    await continuebutton.click();
    await expect(paswordinput).toBeVisible();
    await paswordinput.fill("Jyothi@1981");
    await expect(loginbutton1).toBeVisible();
    await loginbutton1.click();
    await expect(page).toHaveURL(/trello\.com\/.*/);
    console.log("Trello Home Page opened after login");

    //this code is for opening the board
    await expect(page).toHaveURL("https://trello.com/u/harshitalla/boards");
    const board=page.getByRole('link',{name: testData.boardName});
    await expect(board.first()).toBeVisible();
    await board.first().click();
    await expect(page).toHaveURL("https://trello.com/b/8g0POgNz/card-attributes-test-board");
    console.log("Card Attributes Test Board opened");

    //this code for opening the card
    const card = page.getByRole('link', {name: testData.cardName});
    await expect(card).toBeVisible();
    await card.click();

    //this code for verifying the card opened and the doing the card attributes and properites part
    const cardDialog = page.getByRole('dialog', {name: testData.cardName});
    await expect(cardDialog).toBeVisible();
    console.log('Card details opened successfully');

    //this field is for editing the description of the card and saving the description
    const editDescription = page.getByRole('button', {name: 'Edit description'});
    await editDescription.click();
    const descriptionEditor = page.getByRole('dialog', { name: testData.cardName }).locator('[contenteditable="true"]');
    await expect(descriptionEditor).toBeVisible();
    await descriptionEditor.fill('This description was updated using Playwright automation.');
    console.log('New description entered');
    const saveButton = page.getByRole('button', { name: 'Save' });
    await expect(saveButton).toBeVisible();
    await saveButton.click();
    console.log('Description saved');

    //this is to add a green label and verify that the label is applied to the card
    const greenLabelOnCard = page.getByRole('dialog', { name: testData.cardName }).locator('[data-testid="card-label"][data-color="green"]');
    const greenLabelCount = await greenLabelOnCard.count();
    if (greenLabelCount > 0) {
        console.log('Green label is already applied');
    } else {
        console.log('Green label is not applied. Adding it...');

    const labelsButton = page.getByRole('button', {name: 'Labels', exact: true}).first();

    await expect(labelsButton).toBeVisible();
    await labelsButton.click();

    console.log('Labels menu opened');

    const greenLabel = page.locator('[data-testid="clickable-checkbox"]').filter({has: page.locator('[data-testid="card-label"][data-color="green"]')});

    await expect(greenLabel).toBeVisible();
    await greenLabel.click();

    console.log('Green label added');
    }
    await expect(greenLabelOnCard.first()).toBeVisible();
    console.log('Green label verified successfully');


    //this field is for duedate and verifying the due date is applied to the card
    const datesButton = page.getByRole('button', { name: 'Dates' });

    await expect(datesButton).toBeVisible();
    await datesButton.click();

    console.log('Dates menu opened');

    const dueDateField = page.locator(
        '[data-testid="due-date-field"]'
    );

    await expect(dueDateField).toBeVisible();

    const currentDueDate = await dueDateField.inputValue();

    if (currentDueDate) {
        console.log('Due date is already set:', currentDueDate);
    } else {
        console.log('Due date is not set. Adding due date...');

        await dueDateField.fill('9/17/2026');

        const saveDateButton = page.locator(
            '[data-testid="save-date-button"]'
        );

        await expect(saveDateButton).toBeVisible();
        await saveDateButton.click();

        console.log('Due date added');
    }

    await expect(dueDateField).not.toHaveValue('');

    console.log('Due date verified successfully');
    const closeDates = page.getByRole('button', {
        name: 'Close popover'
    });

    await closeDates.click();

    console.log('Dates menu closed');


    //this field is for checklist part
    const checklistButton = page.getByRole('button', {name: 'Checklist', exact: true}).first();

    await expect(checklistButton).toBeVisible();
    await checklistButton.click();

    console.log('Checklist menu opened');

    //this is to add a checklist and verify it is added to the card, only if one is not already there
    const existingChecklistTitle = cardDialog.getByRole('heading', {name: 'Checklist'});
    const existingChecklistCount = await existingChecklistTitle.count();

    if (existingChecklistCount > 0) {
        console.log('Checklist already exists on the card');

        const closeChecklistPopover = page.getByRole('dialog', {name: 'Add checklist'}).getByLabel('Close popover');
        await expect(closeChecklistPopover).toBeVisible();
        await closeChecklistPopover.click();
    } else {
        console.log('No checklist found. Creating one...');

        const checklistNameInput = page.getByRole('textbox', {name: 'Title'});
        await expect(checklistNameInput).toBeVisible();

        const addChecklistButton = page.locator('[data-testid="checklist-add-button"]');
        await expect(addChecklistButton).toBeVisible();
        await addChecklistButton.click();

        console.log('Checklist created');
    }

    await expect(cardDialog.getByRole('heading', {name: 'Checklist'}).first()).toBeVisible();
    console.log('Checklist verified successfully');

    //this field is for adding an item to the checklist and verifying it is added, only if it is not already there
    const checklistItem = cardDialog.getByTestId('check-item-name').filter({hasText: 'First checklist item'});
    const checklistItemCount = await checklistItem.count();

    if (checklistItemCount > 0) {
        console.log('Checklist item already exists');
    } else {
        console.log('Checklist item not found. Adding it...');

        const itemInput = page.getByRole('textbox', {name: 'Add an item'});

        if (!(await itemInput.isVisible())) {
            console.log('Add an item field is collapsed. Expanding it...');
            const addItemTrigger = page.getByText('Add an item', {exact: true});
            await addItemTrigger.click();
        }

        await expect(itemInput).toBeVisible();
        await itemInput.fill('First checklist item');

        const saveItemButton = page.locator('[data-testid="check-item-add-button"]');
        await expect(saveItemButton).toBeVisible();
        await saveItemButton.click();

        console.log('Checklist item added');
    }

    await expect(checklistItem.first()).toBeVisible();
    console.log('Checklist item verified successfully');

    //this is to mark the checklist item complete and verify it is checked, only if it is not already checked
    const itemCheckboxLabel = page.locator('[data-testid="clickable-checkbox"]').filter({has: page.getByRole('checkbox', {name: 'First checklist item'})}).first();
    const itemCheckbox = itemCheckboxLabel.getByRole('checkbox', {name: 'First checklist item'});

    await expect(itemCheckboxLabel).toBeVisible();

    if (await itemCheckbox.isChecked()) {
        console.log('Checklist item is already marked complete');
    } else {
        await itemCheckboxLabel.click();
        console.log('Checklist item marked as complete');

        if (!(await itemCheckbox.isChecked())) {
            console.log('Checkbox not yet toggled, retrying click...');
            await itemCheckboxLabel.click();
        }
    }

    await expect(itemCheckbox).toBeChecked();
    console.log('Checklist item completion verified successfully');

    //this field is for adding a member to the card and verifying it is added, only if one is not already assigned
    const membersButton = page.getByRole('button', {name: 'Members'});
    await expect(membersButton).toBeVisible();
    await membersButton.click();

    console.log('Members menu opened');

    const assignedMemberOnCard = cardDialog.getByRole('heading', {name: 'Members'});
    const assignedMemberCount = await assignedMemberOnCard.count();

    if (assignedMemberCount > 0) {
        console.log('A member is already assigned to the card');
    } else {
        console.log('No member assigned. Adding the first available member...');

        const firstMemberOption = page.getByRole('dialog', {name: 'Members'}).getByRole('button', {name: /^Add /}).first();
        await expect(firstMemberOption).toBeVisible();
        await firstMemberOption.click();

        console.log('Member added');
    }

    await page.keyboard.press('Escape');
    await expect(assignedMemberOnCard.first()).toBeVisible();
    console.log('Member verified successfully');


    //this field is for applying a cover to the card and verifying it is applied, only if one is not already set
    const coverButton = page.locator('[data-testid="card-back-cover-button"]');
    await expect(coverButton).toBeVisible();
    await coverButton.click();

    console.log('Cover menu opened');

    const cardCover = cardDialog.getByRole('button', {name: 'Remove cover'});
    const cardCoverCount = await cardCover.count();

    if (cardCoverCount > 0) {
        console.log('Cover is already applied to the card');
    } else {
        console.log('No cover found. Applying the first color option...');

        const firstColorOption = page.getByRole('dialog', {name: 'Cover'}).getByRole('radiogroup', {name: 'Colors'}).getByRole('radio').first();
        await expect(firstColorOption).toBeVisible();
        await firstColorOption.click();

        console.log('Cover applied');
    }

    await page.keyboard.press('Escape');
    await expect(cardCover).toBeVisible();
    console.log('Cover verified successfully');


    //this field is for adding a link attachment to the card and verifying it is added
    const attachmentButton = page.getByRole('button', {name: 'Attachment', exact: true}).first();
    await expect(attachmentButton).toBeVisible();
    await attachmentButton.click();

    console.log('Attachment menu opened');

    const attachmentOnCard = cardDialog.getByRole('link', {name: 'Google'});
    const attachmentCount = await attachmentOnCard.count();

    if (attachmentCount > 0) {
        console.log('Attachment already exists on the card');

        const closeAttachmentPopover = page.getByRole('dialog', {name: 'Attach'}).getByLabel('Close popover');
        await expect(closeAttachmentPopover).toBeVisible();
        await closeAttachmentPopover.click();
    } else {
        console.log('No attachment found. Adding it...');

        const attachmentLinkInput = page.getByRole('combobox', {name: 'Search or paste a link'});
        await expect(attachmentLinkInput).toBeVisible();
        await attachmentLinkInput.fill('https://www.google.com');

        const attachButton = page.getByRole('button', {name: 'Insert'});
        await expect(attachButton).toBeVisible();
        await attachButton.click();

        console.log('Attachment added');
    }

    await expect(attachmentOnCard.first()).toBeVisible();
    console.log('Attachment verified successfully');


    //this is to toggle the card's complete/incomplete state, verify it flips, then restore the original state
    const completionToggle = cardDialog.getByRole('button', {name: /^Mark this card (complete|incomplete)/});
    await expect(completionToggle).toBeVisible();

    const initialLabel = await completionToggle.getAttribute('aria-label');
    console.log('Initial completion state:', initialLabel);

    await completionToggle.click();
    console.log('Completion state toggled');

    await expect(completionToggle).not.toHaveAttribute('aria-label', initialLabel);
    console.log('Completion state change verified successfully');

    await completionToggle.click();
    console.log('Completion state restored to original');


    //this is to close the card dialog once all card attributes have been verified
    const closeCardButton = page.getByRole('button', {name: 'Close dialog'});
    await expect(closeCardButton).toBeVisible();
    await closeCardButton.click();
    await expect(cardDialog).not.toBeVisible();
    console.log('Card dialog closed successfully - all card attributes verified');
});