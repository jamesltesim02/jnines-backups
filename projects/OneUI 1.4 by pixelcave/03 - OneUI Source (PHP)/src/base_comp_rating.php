<?php require 'inc/config.php'; ?>
<?php require 'inc/views/template_head_start.php'; ?>
<?php require 'inc/views/template_head_end.php'; ?>
<?php require 'inc/views/base_head.php'; ?>

<!-- Page Header -->
<div class="content bg-gray-lighter">
    <div class="row items-push">
        <div class="col-sm-8">
            <h1 class="page-heading">
                Rating <small>Adding rating functionality to your pages has never been easier.</small>
            </h1>
        </div>
        <div class="col-sm-4 text-right hidden-xs">
            <ol class="breadcrumb push-10-t">
                <li>Components</li>
                <li><a class="link-effect" href="">Rating</a></li>
            </ol>
        </div>
    </div>
</div>
<!-- END Page Header -->

<!-- Page Content -->
<div class="content">
    <!-- Rating functionality is initialized in js/pages/base_comp_rating.js, for more examples you can check out https://github.com/wbotelhos/raty -->
    <div class="row">
        <div class="col-md-4">
            <!-- Simple Rating -->
            <div class="block">
                <div class="block-header bg-gray-lighter">
                    <ul class="block-options">
                        <li>
                            <button type="button"><i class="si si-settings"></i></button>
                        </li>
                    </ul>
                    <h3 class="block-title">Simple Rating</h3>
                </div>
                <div class="block-content block-content-full">
                    <p>Setting up rating is just a class away</p>

                    <!-- Rating Container -->
                    <div class="js-rating"></div>
                </div>
            </div>
            <!-- END Simple Rating -->
        </div>
        <div class="col-md-4">
            <!-- Predefined Score -->
            <div class="block">
                <div class="block-header bg-gray-lighter">
                    <ul class="block-options">
                        <li>
                            <button type="button"><i class="si si-settings"></i></button>
                        </li>
                    </ul>
                    <h3 class="block-title">Predefined Score</h3>
                </div>
                <div class="block-content block-content-full">
                    <p>You can easily set a default score</p>

                    <!-- Rating Container -->
                    <div class="js-rating" data-score="3"></div>
                </div>
            </div>
            <!-- END Predefined Score -->
        </div>
        <div class="col-md-4">
            <!-- More Stars -->
            <div class="block">
                <div class="block-header bg-gray-lighter">
                    <ul class="block-options">
                        <li>
                            <button type="button"><i class="si si-settings"></i></button>
                        </li>
                    </ul>
                    <h3 class="block-title">More Stars</h3>
                </div>
                <div class="block-content block-content-full">
                    <p>You can easily set the number of stars</p>

                    <!-- Rating Container -->
                    <div class="js-rating" data-score="5" data-number="10"></div>
                </div>
            </div>
            <!-- END More Stars -->
        </div>
        <div class="col-md-4">
            <!-- Reset Button -->
            <div class="block">
                <div class="block-header bg-gray-lighter">
                    <ul class="block-options">
                        <li>
                            <button type="button"><i class="si si-settings"></i></button>
                        </li>
                    </ul>
                    <h3 class="block-title">Reset Button</h3>
                </div>
                <div class="block-content block-content-full">
                    <p>You can also add a reset button to your rating</p>

                    <!-- Rating Container -->
                    <div class="js-rating" data-cancel="true" data-score="3"></div>
                </div>
            </div>
            <!-- END Reset Button -->
        </div>
        <div class="col-md-4">
            <!-- Hint Text -->
            <div class="block">
                <div class="block-header bg-gray-lighter">
                    <ul class="block-options">
                        <li>
                            <button type="button"><i class="si si-settings"></i></button>
                        </li>
                    </ul>
                    <h3 class="block-title">Hint Text</h3>
                </div>
                <div class="block-content block-content-full">
                    <p>Current Hint: <span class="js-rating-hint-text font-w600">..</span></p>

                    <!-- Rating Container -->
                    <div class="js-rating" data-cancel="true" data-score="3" data-target=".js-rating-hint-text"></div>
                </div>
            </div>
            <!-- END Hint Text -->
        </div>
        <div class="col-md-4">
            <!-- Precision Rating -->
            <div class="block">
                <div class="block-header bg-gray-lighter">
                    <ul class="block-options">
                        <li>
                            <button type="button"><i class="si si-settings"></i></button>
                        </li>
                    </ul>
                    <h3 class="block-title">Precision Rating</h3>
                </div>
                <div class="block-content block-content-full">
                    <p>You can also rate with extra precision</p>

                    <!-- Rating Container -->
                    <div class="js-rating" data-precision="true"></div>
                </div>
            </div>
            <!-- END Precision Rating -->
        </div>
        <div class="col-md-12">
            <!-- Rating Variations -->
            <div class="block">
                <div class="block-header bg-gray-lighter">
                    <ul class="block-options">
                        <li>
                            <button type="button"><i class="si si-settings"></i></button>
                        </li>
                    </ul>
                    <h3 class="block-title">Rating Variations</h3>
                </div>
                <div class="block-content">
                    <p>You can easily set different colors..</p>
                    <div class="row items-push-2x">
                        <div class="col-sm-4">
                            <!-- Rating Container -->
                            <div class="js-rating" data-score="3" data-star-on="fa fa-fw fa-star text-primary"></div>
                        </div>
                        <div class="col-sm-4">
                            <!-- Rating Container -->
                            <div class="js-rating" data-score="3" data-star-on="fa fa-fw fa-star text-success"></div>
                        </div>
                        <div class="col-sm-4">
                            <!-- Rating Container -->
                            <div class="js-rating" data-score="3" data-star-on="fa fa-fw fa-star text-danger"></div>
                        </div>
                    </div>
                    <p>..different icons..</p>
                    <div class="row items-push-2x">
                        <div class="col-sm-4">
                            <!-- Rating Container -->
                            <div class="js-rating" data-score="3" data-star-on="fa fa-fw fa-thumbs-up text-warning" data-star-off="fa fa-fw fa-thumbs-up text-gray"></div>
                        </div>
                        <div class="col-sm-4">
                            <!-- Rating Container -->
                            <div class="js-rating" data-score="3" data-star-on="si si-badge text-info" data-star-off="si si-badge text-gray"></div>
                        </div>
                        <div class="col-sm-4">
                            <!-- Rating Container -->
                            <div class="js-rating" data-score="3" data-star-on="fa fa-fw fa-check text-amethyst" data-star-off="fa fa-fw fa-check text-gray"></div>
                        </div>
                    </div>
                    <p>..or change icons??? size:</p>
                    <div class="row items-push-2x">
                        <div class="col-sm-4">
                            <!-- Rating Container -->
                            <div class="js-rating" data-score="3" data-star-on="fa fa-fw fa-2x fa-star text-warning" data-star-off="fa fa-fw fa-2x fa-star text-gray"></div>
                        </div>
                        <div class="col-sm-4">
                            <!-- Rating Container -->
                            <div class="js-rating" data-score="3" data-star-on="fa fa-fw fa-3x fa-heart text-city" data-star-off="fa fa-fw fa-3x fa-heart text-gray"></div>
                        </div>
                        <div class="col-sm-4">
                            <!-- Rating Container -->
                            <div class="js-rating" data-score="3" data-star-on="fa fa-fw fa-2x fa-check text-flat" data-star-off="fa fa-fw fa-2x fa-check text-gray"></div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- END Rating Variations -->
        </div>
    </div>
</div>
<!-- END Page Content -->

<?php require 'inc/views/base_footer.php'; ?>
<?php require 'inc/views/template_footer_start.php'; ?>

<!-- Page Plugins -->
<script src="<?php echo $one->assets_folder; ?>/js/plugins/jquery-raty/jquery.raty.min.js"></script>

<!-- Page JS Code -->
<script src="<?php echo $one->assets_folder; ?>/js/pages/base_comp_rating.js"></script>

<?php require 'inc/views/template_footer_end.php'; ?>