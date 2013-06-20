/**
 * Model to manipulate nodes in DB.
 */
 
 var mongoose	= require('mongoose'),
	Schema 		= mongoose.Schema,
	fs			= require('fs'),
	exec		= require('child_process').exec,
	im 			= require('imagemagick'),

	config 		= require('../config.json');
	
var Node = new Schema({
	token			: String,
	image: {
		path		: String,
		path_public	: String,
		name		: String,
		name_file	: String,
		datetime	: {
			type	: Date,
			default	: Date.now
		}
	}
});

/*
 * Method definitions.
 */
/*
 * Static definitions.
 */

/**
 * Save image in Folder and data in DB.
 */
Node.statics.upload_image = function (data, callback) {
	var this_model = this;

	return this_model.findOne({
		token: data.node.node_id
	}, function (error, doc) {
		if (!error) {
			// Get the temporary location of the file.
			var tmp_path = data.input.file.path;
			
			// Get the file extension.
			var a = data.input.file.name.split('.');

			var file_type =  data.input.file.type;
			file_type =  file_type.split('/');
			file_type = file_type[0]; // image/...

			// Checking than the loosen the rope risen be by guy image.
			if (file_type == 'image') {
				// Set path to folder of image.
				var target_folder = './public/uploads/image/';
				
				// Name of image, name is node id.
				var image_save = data.node.node_id + Math.floor(Math.random()*55).toString() + '.jpg';
				
				// Set where the image should actually exists.
				var target_path = target_folder + image_save;
				
				// Set path public to show in browser.
				var target_path_public = '/uploads/image/' + image_save;

				// Move the file from the temporary location to the intended location.
				fs.rename(tmp_path, target_path, function (error) {
					im.resize({
						srcPath	: target_path,
						dstPath	: target_path,
						width	: 100
					}, function (err, stdout, stderr) {
						 //if (err) throw err
					});
					
					if (!error) {
						if (!doc) {
							var new_node = new this_model({
								token: data.node.node_id,
								image: {
									path		: target_path,
									path_public	: target_path_public,
									name		: image_save,
									name_file	: data.input.file.name
								}
							});
							
							new_node.save(function (error) {
								if (!error) {									
									callback(null, { msg: 'Image upload.', type: 'success', node_id: data.node.node_id, image: target_path_public });
								} else {
									callback({ msg: 'Error while image upload.', type: 'error' }, null);
								}
							});
						} else {
							fs.unlink(doc.image.path, function (error) {
								if (!error) {
									doc.image.name_file 	= data.input.file.name;
									doc.image.path			= target_path;
									doc.image.path_public 	= target_path_public;

									doc.save();

									callback(null, { msg: 'Image upload.', type: 'success', node_id: data.node.node_id, image: target_path_public });
								} else {
									callback(error, null);
								}
							});
						}
					} else {
						// If fs.rename not process.
						// Move the file from the temporary location to the intended location.
						//fs.rename(tmp_path, target_path, function (error) {
						exec('mv ' + tmp_path + ' ' + target_path, function (error,stdout,stderr) {
							
							if (!error) {
								im.resize({
								srcPath	: target_path,
								dstPath	: target_path,
								width	: 100
							}, function (err, stdout, stderr) {
								 //if (err) throw err
							});
							
							if (!doc) {
								var new_node = new this_model({
									token: data.node.node_id,
									image: {
										path		: target_path,
										path_public	: target_path_public,
										name		: image_save,
										name_file	: data.input.file.name
									}
								});

								new_node.save(function (error, doc) {
									if (!error) {											
										callback(null, { msg: 'Image upload.', type: 'success', node_id: data.node.node_id, image: target_path_public });
									} else {
										callback({ msg: 'Error while image upload.', type: 'error' }, null);
									}
								});
							} else {
								exec('rm ' + doc.image.path, function (error) {
									if (!error) {
										doc.image.name_file 	= data.input.file.name;
										doc.image.path			= target_path;
										doc.image.path_public 	= target_path_public;

										doc.save();

										callback(null, { msg: 'Image upload.', type: 'success', node_id: data.node.node_id, image: target_path_public });
									} else {
										callback(error, null);
									}
								});
							}
							} else {
								callback({ msg: 'Error while image upload.', type: 'error' }, null);
							}
						});
					}
				});
			} else {
				callback({ msg: 'It is not image, please upload a valid image.', type: 'error' }, null);
			}
			} else {
			callback(error, null);
		}
		
	});
};

/**
 * Find image of node by ID.
 */
/*Node.statics.find = function (node_id, callback) {
	var this_model = this;

	return this_model.findOne({
		token: node_id
	}, function (error, doc) {
		if (!error) {
			if (doc) {
				callback({ path: doc.image.path_public });
			} else {
				callback({ path: '/img/generic.jpg' });
			}
		} else {
			callback(error);
		}
	});
};*/

/**
 * Obtain all image nodes.
 *
 * @param callback
 * @returns {Promise}
 */
Node.statics.all = function (callback) {
	var this_model = this;
		
	return this_model.find({})
		.exec(function (error, docs) {
			if (!error) {
				callback(docs);
			} else {
				callback(error);
			}
		});
};

/**
 * Reset image of node by ID.
 *
 * @param node_id
 * @param callback
 */
Node.statics.reset_image = function (node_id, callback) {
	var this_model = this;

	/*return this_model.find({
		token: node_id
	}, function (error, doc) {
		if (!error) {
			doc.remove();
			callback(null);
		} else {
			callback(error);
		}
	});*/

	return this_model.remove({
		token: node_id
	}, function (error) {
		if (!error) {
			
			callback(null);
		}
		else {
			callback(error);
		}
	});
};

module.exports = mongoose.model('Node', Node);
