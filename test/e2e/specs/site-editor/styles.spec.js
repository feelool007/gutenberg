/**
 * WordPress dependencies
 */
const { test, expect } = require( '@wordpress/e2e-test-utils-playwright' );

test.describe( 'Styles', () => {
	test.beforeAll( async ( { requestUtils } ) => {
		await requestUtils.activateTheme( 'twentytwentythree' );
	} );

	test.afterAll( async ( { requestUtils } ) => {
		await requestUtils.activateTheme( 'twentytwentyone' );
	} );

	test( 'should override reset styles and library styles', async ( {
		admin,
		editor,
		requestUtils,
		page,
	} ) => {
		const { id } = await requestUtils.createPage( {
			title: 'Social Icons',
			content: `<!-- wp:social-links -->
<ul class="wp-block-social-links"></ul>
<!-- /wp:social-links -->`,
			status: 'publish',
		} );
		await admin.visitSiteEditor( {
			postId: id,
			postType: 'page',
			canvas: 'edit',
		} );

		const block = editor.canvas.getByRole( 'document', {
			name: 'Block: Social Icons',
		} );

		await expect( block ).toHaveCSS( 'padding-left', '0px' );

		const topBar = page.getByRole( 'region', { name: 'Editor top bar' } );
		// Navigate to Styles -> Blocks -> Heading -> Typography
		await topBar.getByRole( 'button', { name: 'Styles' } ).click();
		await page.getByRole( 'button', { name: 'Blocks styles' } ).click();
		await page
			.getByRole( 'button', { name: 'Social Icons block styles' } )
			.click();

		// find the second padding control
		const paddingControl = page
			.locator( '[aria-label="padding"]' )
			.nth( 1 );

		// Change the padding value
		await paddingControl.fill( '2' );

		// Check the padding value
		await expect( block ).toHaveCSS( 'padding-left', '35.4644px' );
	} );
} );
