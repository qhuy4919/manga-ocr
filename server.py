from flask import request, Flask, send_file, jsonify
app = Flask(__name__)

from storage import FileStorage
FS = FileStorage('./data')

@app.route('/upload', methods=['POST'])
def upload():
    if 'image' not in request.files:
        return jsonify({
            'message': 'Missing required image',
        }), 400

    image = request.files['image']
    url = FS.save_file(image)
    return jsonify({
        'message': 'Image uploaded successfully!',
        'data': {
            'file_name': url
        }
    })

@app.route('/image/<path:filename>')
def get_image(filename):
    if not FS.does_file_name_exist(filename):
        return jsonify({ 'message': 'Image not found', }), 404

    file_url = FS.get_file_url(filename)
    try:
        return send_file(file_url)
    except:
        return jsonify({ 'message': 'Cannot get image', }), 500


@app.route('/image/<path:filename>', methods=['DELETE'])
def delete_file(filename):
    if not FS.does_file_name_exist(filename):
        return jsonify({ 'message': 'Image not found', }), 404

    if FS.delete_file(filename):
        return jsonify({ 'message': 'Ok', })

    return jsonify({ 'message': 'Cannot delete image', }), 500

if __name__ == '__main__':
    from config import DefaultConfig as conf
    app.run(host=conf.get_host(), port=conf.get_port())
